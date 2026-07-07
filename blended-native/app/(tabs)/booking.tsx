import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { barbers } from '../../lib/data/barbers';
import { getAppColors } from '../../lib/theme';
import { FONT_DISPLAY } from '../../lib/ui';
import { loadLastBooking, saveLastBooking, type BookingReceipt } from '../../lib/storage/booking';

type Step = 1 | 2 | 3;

const OPEN_HOUR = 10;
const CLOSE_HOUR = 21;

function buildSlots(): string[] {
  const slots: string[] = [];
  for (let h = OPEN_HOUR; h <= CLOSE_HOUR; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

// Жишээ: тодорхой barber + цаг аль хэдийн захиалгатай гэж үзнэ
function isBooked(barberId: string, date: string, time: string): boolean {
  const seed = barberId + date + time;
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n + seed.charCodeAt(i) * (i + 1)) % 97;
  return n % 5 === 0;
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function mnWeekdayShort(d: Date) {
  return ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя'][d.getDay()];
}

function mnWeekdayLong(d: Date) {
  return ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'][d.getDay()];
}

function parseISODate(iso: string) {
  const [y, m, dd] = iso.split('-').map((x) => Number(x));
  // local noon to avoid timezone edge cases
  return new Date(y, (m ?? 1) - 1, dd ?? 1, 12, 0, 0, 0);
}

function formatMnDateLong(iso: string) {
  const d = parseISODate(iso);
  const yyyy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${yyyy} оны ${mm}-р сарын ${dd}, ${mnWeekdayLong(d)}`;
}

const impactLight = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics нь зарим орчинд боломжгүй байж болно (web гэх мэт)
  }
};

const impactMedium = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // no-op
  }
};

const Stepper: React.FC<{ step: Step }> = ({ step }) => {
  const pct = step === 1 ? 34 : step === 2 ? 67 : 100;
  const label =
    step === 1 ? 'Барбер сонгох' : step === 2 ? 'Өдөр & цаг сонгох' : 'Баталгаажуулах';

  const anim = useRef(new Animated.Value(pct)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [anim, pct]);

  const widthInterpolate = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.stepperPill} accessibilityRole="summary">
      <View style={styles.stepperTopRow}>
        <Text style={styles.stepperLeft}>Алхам {step} / 3</Text>
        <Text style={styles.stepperRight} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={styles.stepperTrack}>
        <Animated.View style={[styles.stepperFill, { width: widthInterpolate }]} />
      </View>
    </View>
  );
};

export default function BookingScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const c = getAppColors(isDark ? 'dark' : 'light');
  const insets = useSafeAreaInsets();

  const slots = useMemo(() => buildSlots(), []);

  const [barberId, setBarberId] = useState<string | null>(null);
  const [date, setDate] = useState(() => toISODate(new Date()));
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; form?: string }>({});
  const [lastReceipt, setLastReceipt] = useState<BookingReceipt | null>(null);

  const scrollRef = useRef<ScrollView | null>(null);
  const daySectionY = useRef<number>(0);
  const confirmSectionY = useRef<number>(0);

  const nameRef = useRef<TextInput | null>(null);
  const phoneRef = useRef<TextInput | null>(null);

  const selectedBarber = useMemo(
    () => barbers.find((b) => b.id === barberId) ?? null,
    [barberId]
  );

  useEffect(() => {
    (async () => {
      const r = await loadLastBooking();
      setLastReceipt(r);
    })();
  }, []);

  const dayOptions = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 10 }).map((_, i) => {
      const d = addDays(base, i);
      return {
        iso: toISODate(d),
        wd: mnWeekdayShort(d),
        dd: d.getDate().toString().padStart(2, '0'),
        mm: (d.getMonth() + 1).toString().padStart(2, '0'),
        isToday: i === 0,
      };
    });
  }, []);

  const step: Step = !barberId ? 1 : !time ? 2 : 3;

  const bg = c.bg;

  const resetAll = () => {
    setBarberId(null);
    setDate(toISODate(new Date()));
    setTime(null);
    setName('');
    setPhone('');
    setSubmitted(false);
    setSubmitting(false);
    setErrors({});
  };

  const resetFlow = () => {
    setSubmitted(false);
    setTime(null);
    setName('');
    setPhone('');
    setSubmitting(false);
    setErrors({});
  };

  const scrollToDaySection = () => {
    scrollRef.current?.scrollTo({ y: Math.max(0, daySectionY.current - 10), animated: true });
  };

  const scrollToConfirmSection = () => {
    scrollRef.current?.scrollTo({
      y: Math.max(0, confirmSectionY.current - 10),
      animated: true,
    });
  };

  const validateAndSubmit = async () => {
    const cleanedPhone = phone.replace(/\D/g, '');
    const nextErrors: { name?: string; phone?: string; form?: string } = {};
    if (name.trim().length < 2) nextErrors.name = 'Нэрээ дор хаяж 2 тэмдэгтээр оруулна уу.';
    if (cleanedPhone.length < 8) nextErrors.phone = 'Утасны дугаар дор хаяж 8 оронтой байна.';
    if (!barberId) nextErrors.form = 'Эхлээд барбер сонгоно уу.';
    if (barberId && !time) nextErrors.form = 'Эхлээд цаг сонгоно уу.';
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) {
      await impactLight();
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.phone) phoneRef.current?.focus();
      return;
    }
    if (!barberId || !time) {
      await impactLight();
      return;
    }

    // Хамгаалалт: UI дээр дүүрсэн цагийг дарж болохгүй ч submit дээр дахин шалгана
    if (isBooked(barberId, date, time)) {
      setErrors({ form: 'Уучлаарай, энэ цаг дүүрсэн байна. Өөр цаг сонгоно уу.' });
      await impactLight();
      return;
    }

    if (!selectedBarber) return;

    setSubmitting(true);
    try {
      // Server байхгүй үед V1: receipt-г локал хадгална
      const receipt: BookingReceipt = {
        barberId,
        barberName: selectedBarber.name,
        barberTitle: selectedBarber.title,
        dateIso: date,
        time,
        name: name.trim(),
        phone: cleanedPhone,
        createdAtIso: new Date().toISOString(),
      };
      await saveLastBooking(receipt);
      setLastReceipt(receipt);

      // UX: жоохон “processing” мэдрэмж
      await new Promise((r) => setTimeout(r, 380));
    } finally {
      setSubmitting(false);
    }

    await impactMedium();
    setSubmitted(true);
  };

  // Tab bar (~80px) + safe area + extra gap → CTA нь tab bar‑ын дээгүүр 100% харагдана
  const bottomCtaBottom = 112 + insets.bottom;
  const bottomCtaHeight = 52;
  const bottomCtaGap = 14;
  const bottomContentPadding = Math.max(140, bottomCtaBottom + bottomCtaHeight + bottomCtaGap + 24);

  if (submitted && selectedBarber && time) {
    return (
      <View style={[styles.successWrap, { backgroundColor: bg, paddingTop: insets.top + 24 }]}>
        <View style={[styles.successInner, { borderColor: c.cardBorder, backgroundColor: c.card }]}>
          <Feather name="check-circle" size={64} color={c.fg} />
          <Text style={[styles.successTitle, { fontFamily: FONT_DISPLAY, color: c.fg }]}>
            Захиалга амжилттай!
          </Text>
          <Text style={[styles.successSubtitle, { color: c.muted }]}>
            Бид тантай холбоо барих болно.
          </Text>

          {lastReceipt ? (
            <View style={[styles.receiptCard, { borderColor: c.cardBorder }]}>
              <Text style={[styles.receiptKicker, { color: c.muted2 }]}>RECEIPT</Text>
              <Text style={[styles.receiptLine, { color: c.fg }]}>
                {lastReceipt.barberName} · {lastReceipt.barberTitle}
              </Text>
              <Text style={[styles.receiptLine, { color: c.fg }]}>
                {formatMnDateLong(lastReceipt.dateIso)} · {lastReceipt.time}
              </Text>
              <Text style={[styles.receiptLine, { color: c.muted }]}>
                {lastReceipt.name} · {lastReceipt.phone}
              </Text>
            </View>
          ) : null}

          <View style={styles.successActions}>
            <Pressable
              onPress={async () => {
                await impactLight();
                resetAll();
              }}
              style={({ pressed }) => [
                styles.successBtnPrimary,
                { opacity: pressed ? 0.85 : 1, backgroundColor: c.primaryBg },
              ]}
            >
              <Text style={[styles.successBtnPrimaryText, { color: c.primaryFg }]}>
                Дахин захиалах
              </Text>
            </Pressable>

            <View style={styles.successRow}>
              <Pressable
                onPress={async () => {
                  await impactLight();
                  Linking.openURL('tel:88668612');
                }}
                style={({ pressed }) => [
                  styles.successBtnSecondary,
                  { opacity: pressed ? 0.85 : 1, borderColor: c.cardBorder },
                ]}
              >
                <Feather name="phone" size={16} color={c.fg} />
                <Text style={[styles.successBtnSecondaryText, { color: c.fg }]}>Дуудлага хийх</Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  await impactLight();
                  setErrors({ form: 'Хуанлид нэмэх нь дараагийн хувилбарт нэмэгдэнэ.' });
                }}
                style={({ pressed }) => [
                  styles.successBtnSecondary,
                  { opacity: pressed ? 0.85 : 1, borderColor: c.cardBorder },
                ]}
              >
                <Feather name="calendar" size={16} color={c.fg} />
                <Text style={[styles.successBtnSecondaryText, { color: c.fg }]}>Хуанлид нэмэх</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: bg }]}>
      <ScrollView
        ref={(r) => {
          scrollRef.current = r;
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(16, insets.top + 10), paddingBottom: bottomContentPadding },
        ]}
      >
          <Stepper step={step} />

          {/* STEP 1: Барбер сонгох */}
          <View style={styles.section}>
            <Text style={[styles.h1, { fontFamily: FONT_DISPLAY, color: c.fg }]}>
              Барбер сонгох
            </Text>
            <Text style={[styles.subhead, { color: c.muted2 }]}>
              Зураг, нэр, зэргийг үзэж сонгоно уу.
            </Text>

            <View style={{ marginTop: 14, gap: 12 }}>
              {barbers.map((b) => {
                const active = barberId === b.id;
                return (
                  <Pressable
                    key={b.id}
                    onPress={async () => {
                      await impactLight();
                      setBarberId(b.id);
                      setTime(null);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`${b.name} барбер сонгох`}
                    style={({ pressed }) => [
                      styles.barberRow,
                      {
                        borderColor: active ? c.fg : c.cardBorder,
                        backgroundColor: active
                          ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')
                          : c.card,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <Image source={{ uri: b.imageUrl }} style={styles.barberAvatar} contentFit="cover" />
                    <View style={styles.barberTextCol}>
                      <Text style={[styles.barberName, { color: c.fg }]}>{b.name}</Text>
                      <Text style={[styles.barberTitle, { color: c.muted2 }]}>{b.title}</Text>
                    </View>
                    {active ? (
                      <View style={[styles.selectedMark, { borderColor: c.divider, backgroundColor: c.card }]}>
                        <Feather name="check" size={16} color={c.fg} />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* STEP 2: Өдөр & цаг сонгох */}
          <View
            onLayout={(e) => {
              daySectionY.current = e.nativeEvent.layout.y;
            }}
            style={[styles.section, { opacity: barberId ? 1 : 0.55 }]}
          >
            <View style={styles.collapsedBarberRow}>
              <Text style={styles.collapsedLabel}>Сонгосон</Text>
              <Text style={styles.collapsedValue} numberOfLines={1}>
                {selectedBarber ? selectedBarber.name : '—'}
              </Text>
              {barberId ? (
                <Pressable
                  onPress={async () => {
                    await impactLight();
                    setBarberId(null);
                    setTime(null);
                  }}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                >
                  <Text style={styles.changeText}>Солих</Text>
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayStrip}
            >
              {dayOptions.map((d) => {
                const active = d.iso === date;
                const disabled = !barberId;
                return (
                  <Pressable
                    key={d.iso}
                    disabled={disabled}
                    onPress={async () => {
                      await impactLight();
                      setDate(d.iso);
                      setTime(null);
                    }}
                    style={({ pressed }) => [
                      styles.dayCard,
                      {
                        backgroundColor: active ? '#ffffff' : '#18181b',
                        opacity: disabled ? 0.55 : pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.dayWd, { color: active ? '#09090b' : '#a1a1aa' }]}>
                      {d.wd}
                    </Text>
                    <Text style={[styles.dayDd, { color: active ? '#09090b' : '#ffffff' }]}>
                      {d.dd}
                    </Text>
                    <Text style={[styles.dayMm, { color: active ? '#09090b' : '#a1a1aa' }]}>
                      {d.mm}
                    </Text>
                    {d.isToday ? (
                      <Text
                        style={[
                          styles.todayLabel,
                          { color: active ? '#09090b' : '#a1a1aa' },
                        ]}
                      >
                        Өнөөдөр
                      </Text>
                    ) : (
                      <View style={{ height: 12 }} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={styles.timeLabel}>БОЛОМЖИТ ЦАГ</Text>

            <FlatList
              data={slots}
              keyExtractor={(t) => t}
              numColumns={4}
              scrollEnabled={false}
              columnWrapperStyle={styles.timeRow}
              contentContainerStyle={styles.timeList}
              renderItem={({ item: t }) => {
                const booked = Boolean(barberId && isBooked(barberId, date, t));
                const disabled = !barberId || booked;
                const active = time === t;
                return (
                  <Pressable
                    disabled={disabled}
                    onPress={async () => {
                      await impactLight();
                      setTime(t);
                      scrollToConfirmSection();
                    }}
                    style={({ pressed }) => [
                      styles.timeBtn,
                      booked
                        ? styles.timeBtnBooked
                        : active
                          ? styles.timeBtnActive
                          : styles.timeBtnIdle,
                      { opacity: disabled ? 0.55 : pressed ? 0.88 : 1 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        booked
                          ? styles.timeTextBooked
                          : active
                            ? styles.timeTextActive
                            : styles.timeTextIdle,
                      ]}
                    >
                      {t}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>

          {/* STEP 3: Баталгаажуулах */}
          <View
            onLayout={(e) => {
              confirmSectionY.current = e.nativeEvent.layout.y;
            }}
            style={[styles.section, { opacity: barberId && time ? 1 : 0.55 }]}
          >
            {barberId && time && selectedBarber ? (
              <>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Товч мэдээлэл</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryKey}>Барбер</Text>
                    <Text style={styles.summaryVal}>
                      {selectedBarber.name} · {selectedBarber.title}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryKey}>Өдөр</Text>
                    <Text style={styles.summaryVal}>{formatMnDateLong(date)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryKey}>Цаг</Text>
                    <Text style={styles.summaryVal}>{time}</Text>
                  </View>
                </View>

                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
                >
                  <View style={{ marginTop: 16, gap: 12 }}>
                    <View>
                      <Text style={styles.inputLabel}>НЭР</Text>
                      <TextInput
                        ref={(r) => {
                          nameRef.current = r;
                        }}
                        value={name}
                      onChangeText={(v) => {
                        setName(v);
                        if (errors.name) setErrors((p) => ({ ...p, name: undefined, form: p.form }));
                      }}
                        placeholder="Таны нэр"
                        placeholderTextColor="#52525b"
                        returnKeyType="next"
                        onSubmitEditing={() => phoneRef.current?.focus()}
                        style={styles.input}
                      />
                      {errors.name ? (
                        <Text style={[styles.errorText, { color: c.danger }]}>{errors.name}</Text>
                      ) : null}
                    </View>

                    <View>
                      <Text style={styles.inputLabel}>УТАС</Text>
                      <TextInput
                        ref={(r) => {
                          phoneRef.current = r;
                        }}
                        value={phone}
                      onChangeText={(v) => {
                        setPhone(v);
                        if (errors.phone) setErrors((p) => ({ ...p, phone: undefined, form: p.form }));
                      }}
                        placeholder="99112233"
                        placeholderTextColor="#52525b"
                        keyboardType="numeric"
                        returnKeyType="done"
                        onSubmitEditing={async () => {
                          Keyboard.dismiss();
                          await validateAndSubmit();
                        }}
                        style={styles.input}
                      />
                      {errors.phone ? (
                        <Text style={[styles.errorText, { color: c.danger }]}>{errors.phone}</Text>
                      ) : null}
                    </View>

                    <Pressable
                      disabled={submitting}
                      onPress={async () => {
                        Keyboard.dismiss();
                        await validateAndSubmit();
                      }}
                      style={({ pressed }) => [
                        styles.submitBtn,
                        {
                          opacity: submitting ? 0.6 : pressed ? 0.88 : 1,
                          backgroundColor: c.primaryBg,
                          shadowColor: c.primaryShadow,
                        },
                      ]}
                    >
                      <Text style={[styles.submitText, { color: c.primaryFg }]}>
                        {submitting ? 'Илгээж байна…' : 'БАТАЛГААЖУУЛАХ'}
                      </Text>
                      <Feather name="chevron-right" size={18} color={c.primaryFg} />
                    </Pressable>
                    {errors.form ? (
                      <Text style={[styles.formErrorText, { color: c.danger }]}>{errors.form}</Text>
                    ) : null}

                    <Pressable
                      onPress={async () => {
                        await impactLight();
                        resetFlow();
                      }}
                      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, alignSelf: 'center' }]}
                    >
                      <Text style={styles.secondaryReset}>Дахин сонгох</Text>
                    </Pressable>
                  </View>
                </KeyboardAvoidingView>
              </>
            ) : (
              <Text style={styles.hint}>
                Барбер, өдөр, цаг сонгосны дараа баталгаажуулна.
              </Text>
            )}
          </View>
      </ScrollView>

      {/* STICKY BOTTOM CTA (step 1 only) */}
      {step === 1 ? (
        <View style={[styles.bottomCtaWrap, { bottom: bottomCtaBottom }]}>
          <View style={styles.bottomCtaGradient} pointerEvents="none" />
          <Pressable
            disabled={!barberId}
            onPress={async () => {
              await impactLight();
              scrollToDaySection();
            }}
            style={({ pressed }) => [
              styles.bottomCta,
              barberId ? styles.bottomCtaEnabled : styles.bottomCtaDisabled,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={barberId ? styles.bottomCtaTextEnabled : styles.bottomCtaTextDisabled}>
              {barberId ? 'Өдөр сонгох →' : 'Барбер сонгоно уу'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 16,
  },

  stepperPill: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  stepperTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  stepperLeft: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 2.2,
    color: '#52525b',
    textTransform: 'uppercase',
  },
  stepperRight: {
    flex: 1,
    textAlign: 'right',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: '#71717a',
    textTransform: 'uppercase',
  },
  stepperTrack: {
    marginTop: 10,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  stepperFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.30)',
  },

  section: {
    marginTop: 18,
  },
  h1: {
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 1.2,
    color: '#ffffff',
  },
  subhead: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#71717a',
    lineHeight: 20,
  },

  barberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
  },
  barberAvatar: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#18181b',
  },
  barberTextCol: {
    flex: 1,
    minWidth: 0,
  },
  barberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  barberTitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#71717a',
  },
  selectedMark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  collapsedBarberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  collapsedLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: '#52525b',
    textTransform: 'uppercase',
  },
  collapsedValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  changeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#52525b',
  },

  dayStrip: {
    paddingRight: 6,
    gap: 10,
  },
  dayCard: {
    width: 52,
    height: 64,
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dayWd: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  dayDd: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  dayMm: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  todayLabel: {
    marginTop: 4,
    fontSize: 8,
    fontWeight: '700',
  },

  timeLabel: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2.6,
    color: '#71717a',
    textTransform: 'uppercase',
  },
  timeList: {
    gap: 10,
  },
  timeRow: {
    gap: 10,
    justifyContent: 'space-between',
  },
  timeBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBtnIdle: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  timeBtnActive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  timeBtnBooked: {
    backgroundColor: '#0b0b0c',
    borderWidth: 0,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeTextIdle: { color: '#ffffff' },
  timeTextActive: { color: '#09090b' },
  timeTextBooked: { color: '#3f3f46', textDecorationLine: 'line-through' },

  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 14,
  },
  summaryTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2.6,
    color: '#71717a',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  summaryKey: {
    fontSize: 11,
    fontWeight: '800',
    color: '#a1a1aa',
  },
  summaryVal: {
    flex: 1,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },

  inputLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2.6,
    color: '#71717a',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.20)',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(251,113,133,0.9)',
    lineHeight: 16,
  },
  formErrorText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(251,113,133,0.9)',
    lineHeight: 16,
    textAlign: 'center',
  },
  submitBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#fff',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  submitText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3.2,
    color: '#09090b',
    textTransform: 'uppercase',
  },
  secondaryReset: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.4,
    color: '#52525b',
    textTransform: 'uppercase',
  },
  hint: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },

  bottomCtaWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 50,
    elevation: 12,
  },
  bottomCtaGradient: {
    position: 'absolute',
    left: -16,
    right: -16,
    bottom: -30,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.32)',
    opacity: 0.55,
  },
  bottomCta: {
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  bottomCtaEnabled: {
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  bottomCtaDisabled: {
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  bottomCtaTextEnabled: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3.2,
    color: '#09090b',
    textTransform: 'uppercase',
  },
  bottomCtaTextDisabled: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3.2,
    color: '#52525b',
    textTransform: 'uppercase',
  },

  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  successInner: {
    width: '100%',
    maxWidth: 520,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 28,
    paddingHorizontal: 18,
  },
  successTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 0.7,
    color: '#ffffff',
  },
  successSubtitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#a1a1aa',
    textAlign: 'center',
  },
  receiptCard: {
    width: '100%',
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
  },
  receiptKicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  receiptLine: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 4,
  },
  successActions: {
    width: '100%',
    marginTop: 14,
    gap: 10,
  },
  successRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  successBtnPrimary: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBtnPrimaryText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3.0,
    textTransform: 'uppercase',
  },
  successBtnSecondary: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  successBtnSecondaryText: {
    fontSize: 11,
    fontWeight: '800',
  },
});

