import React, { useMemo, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import {
  ActionSheetIOS,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, type ThemeMode } from '../../providers/ThemeProvider';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { scheme, mode, setMode } = useTheme();
  const isDark = scheme === 'dark';
  const [showThemeControls, setShowThemeControls] = useState(false);

  const colors = useMemo(
    () => ({
      bg: isDark ? '#000000' : '#ffffff',
      cardBg: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      border: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)',
      text: isDark ? '#ffffff' : '#09090b',
      sub: isDark ? '#a1a1aa' : '#71717a',
      icon: isDark ? '#a1a1aa' : '#71717a',
      chevron: isDark ? '#a1a1aa' : '#a1a1aa',
      pill: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    }),
    [isDark]
  );

  const impactLight = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics нь зарим орчинд боломжгүй байж болно
    }
  };

  const applyTheme = async (next: ThemeMode) => {
    await impactLight();
    setMode(next);
  };

  const currentThemeLabel = isDark ? 'Харанхуй' : 'Цайлган';
  const currentModeLabel =
    mode === 'system' ? 'Систем' : mode === 'dark' ? 'Харанхуй' : 'Цайлган';

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(16, insets.top + 10), paddingBottom: 120 + insets.bottom },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1) Profile placeholder card */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <View
          style={[
            styles.userIconCircle,
            { borderColor: colors.border, backgroundColor: colors.pill },
          ]}
        >
          <Feather name="user" size={28} color={colors.icon} />
        </View>

        <Text style={[styles.profileTitle, { color: colors.text, fontFamily: 'Georgia' }]}>
          Профайл
        </Text>
        <Text style={[styles.profileBody, { color: colors.sub }]}>
          Нэвтрэлт, захиалгын түүх зэргийг энд холбож болно. Одоогоор UI-ийн placeholder.
        </Text>
      </View>

      {/* 2) Settings menu card */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Pressable
          onPress={async () => {
            await impactLight();

            if (Platform.OS === 'ios') {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  title: 'Theme',
                  message: 'Light / Dark theme',
                  options: ['Цайлган', 'Харанхуй', 'Систем', 'Цуцлах'],
                  cancelButtonIndex: 3,
                },
                async (idx) => {
                  if (idx === 0) await applyTheme('light');
                  if (idx === 1) await applyTheme('dark');
                  if (idx === 2) await applyTheme('system');
                }
              );
              return;
            }

            // Android/Web дээр inline toggle харуулна
            setShowThemeControls((v) => !v);
          }}
          style={({ pressed }) => [styles.row, { opacity: pressed ? 0.88 : 1 }]}
        >
          <View style={[styles.rowIconBox, { borderColor: colors.border }]}>
            <Feather name="settings" size={18} color={colors.icon} />
          </View>

          <View style={styles.rowTextCol}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Тохиргоо</Text>
            <Text style={[styles.rowSubtitle, { color: colors.sub }]}>Light / Dark theme</Text>
          </View>

          <Feather name="chevron-right" size={16} color={colors.chevron} />
        </Pressable>

        {/* 3) Theme toggle (inline) */}
        {showThemeControls ? (
          <View style={[styles.inlineThemeWrap, { borderTopColor: colors.border }]}>
            <View style={styles.inlineThemeRow}>
              <Text style={[styles.inlineThemeLabel, { color: colors.sub }]}>
                Одоогийн theme
              </Text>
              <Text style={[styles.inlineThemeValue, { color: colors.text }]}>
                {currentThemeLabel} · {currentModeLabel}
              </Text>
            </View>

            <View style={styles.toggleRow}>
              <Pressable
                onPress={() => applyTheme('light')}
                style={({ pressed }) => [
                  styles.togglePill,
                  {
                    opacity: pressed ? 0.88 : 1,
                    backgroundColor: mode === 'light' ? '#ffffff' : colors.pill,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather name="sun" size={16} color={mode === 'light' ? '#09090b' : colors.icon} />
                <Text style={[styles.toggleText, { color: mode === 'light' ? '#09090b' : colors.text }]}>
                  Цайлган
                </Text>
              </Pressable>

              <Pressable
                onPress={() => applyTheme('dark')}
                style={({ pressed }) => [
                  styles.togglePill,
                  {
                    opacity: pressed ? 0.88 : 1,
                    backgroundColor: mode === 'dark' ? '#ffffff' : colors.pill,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather name="moon" size={16} color={mode === 'dark' ? '#09090b' : colors.icon} />
                <Text style={[styles.toggleText, { color: mode === 'dark' ? '#09090b' : colors.text }]}>
                  Харанхуй
                </Text>
              </Pressable>

              <Pressable
                onPress={() => applyTheme('system')}
                style={({ pressed }) => [
                  styles.togglePill,
                  {
                    opacity: pressed ? 0.88 : 1,
                    backgroundColor: mode === 'system' ? '#ffffff' : colors.pill,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather
                  name="smartphone"
                  size={16}
                  color={mode === 'system' ? '#09090b' : colors.icon}
                />
                <Text style={[styles.toggleText, { color: mode === 'system' ? '#09090b' : colors.text }]}>
                  Систем
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    gap: 14,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },

  userIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  profileBody: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  rowIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextCol: { flex: 1, minWidth: 0 },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },

  inlineThemeWrap: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  inlineThemeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  inlineThemeLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  inlineThemeValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  togglePill: {
    flexGrow: 1,
    flexBasis: 0,
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '800',
  },
});

