"use client";

import Image from "next/image";
import { CalendarDays, CheckCircle2, ChevronRight, Clock, Loader2, Scissors, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBarbers } from "@/hooks/useBarbers";
import {
  buildSlotsForDate,
  getDaySchedule,
  isBarberWorkingOnDate,
} from "@/lib/barbers/schedule";
import {
  fetchBookedTimes,
} from "@/lib/supabase/queries";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { apiUrl } from "@/lib/api-base";
import { cancelPendingAppointmentClient } from "@/lib/appointments/cancel-pending-client";
import { useAuth } from "@/components/providers/AuthProvider";

import {
  DEFAULT_BOOKING_PRICE_MNT,
  formatBookingPriceMnt,
} from "@/lib/appointments/pricing";

const TZ = "Asia/Ulaanbaatar";

type QPayPayload = {
  invoiceId: string;
  qrText: string | null;
  qrImage: string | null;
  shortUrl: string | null;
  urls: { name: string; description: string; logo: string; link: string }[];
};

function toISODate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function toMongoliaDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00+08:00`);
}

function isPastSlot(date: string, time: string): boolean {
  return toMongoliaDateTime(date, time).getTime() <= Date.now();
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function mnWeekdayShort(d: Date) {
  return ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"][d.getDay()];
}

function scrollToRef(ref: React.RefObject<HTMLElement | null>) {
  window.setTimeout(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Baber", Icon: Scissors },
    { n: 2, label: "Өдөр", Icon: CalendarDays },
    { n: 3, label: "Цаг", Icon: Clock },
  ] as const;

  return (
    <>
      {/* Mobile progress */}
      <div
        className="mb-5 rounded-2xl border border-achira-blue/12 bg-achira-paper/70 px-3 py-2.5 backdrop-blur-md dark:border-achira-cream/10 dark:bg-achira-blue/10 md:hidden"
        role="group"
        aria-label="Захиалгын алхам"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-achira-blue/55 dark:text-achira-cream/50">
            Алхам {step} / 3
          </p>
          <p className="truncate text-[9px] font-medium uppercase tracking-[0.2em] text-achira-blue/50 dark:text-achira-cream/45">
            {step === 1 ? "Baber сонгох" : step === 2 ? "Өдөр сонгох" : "Цаг сонгох"}
          </p>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-achira-blue/10 dark:bg-achira-cream/10">
          <div
            className="h-full rounded-full bg-achira-blue transition-[width] duration-300 ease-out dark:bg-achira-cream/50"
            style={{ width: `${step === 1 ? 34 : step === 2 ? 67 : 100}%` }}
          />
        </div>
      </div>

      {/* Desktop stepper */}
      <ol
        className="mb-10 hidden items-center justify-center gap-0 md:flex"
        aria-label="Захиалгын алхам"
      >
        {steps.map(({ n, label, Icon }, i) => {
          const done = step > n;
          const active = step === n;
          return (
            <li key={n} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                    done
                      ? "border-achira-blue bg-achira-blue text-achira-cream dark:border-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                      : active
                        ? "border-achira-blue bg-achira-blue/10 text-achira-blue shadow-[0_0_0_4px_rgba(30,79,150,0.12)] dark:border-achira-cream dark:bg-achira-cream/10 dark:text-achira-cream dark:shadow-[0_0_0_4px_rgba(245,240,232,0.08)]"
                        : "border-achira-blue/15 bg-white/50 text-achira-blue/35 dark:border-achira-cream/15 dark:bg-achira-navy/40 dark:text-achira-cream/35"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
                  ) : (
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium uppercase tracking-[0.22em] ${
                    active || done
                      ? "text-achira-blue-dark dark:text-achira-cream"
                      : "text-achira-blue/40 dark:text-achira-cream/35"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-4 mb-6 h-px w-16 sm:w-24 lg:w-32 ${
                    step > n ? "bg-achira-blue/40 dark:bg-achira-cream/35" : "bg-achira-blue/12 dark:bg-achira-cream/10"
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function BookingSystem() {
  const { barbers } = useBarbers();
  const { profile } = useAuth();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [date, setDate] = useState(() => toISODate(new Date()));
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [qpay, setQpay] = useState<QPayPayload | null>(null);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [totalMnt, setTotalMnt] = useState(DEFAULT_BOOKING_PRICE_MNT);
  const [polling, setPolling] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const daySectionRef = useRef<HTMLDivElement | null>(null);
  const timeSectionRef = useRef<HTMLDivElement | null>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const paymentTopRef = useRef<HTMLDivElement | null>(null);
  const appointmentIdRef = useRef<string | null>(null);
  const submittedRef = useRef(false);
  const profilePrefilledRef = useRef(false);

  const selectedBarber = barbers.find((b) => b.id === barberId);
  const bookingPriceMnt =
    selectedBarber?.bookingPriceMnt ?? DEFAULT_BOOKING_PRICE_MNT;
  const slots = useMemo(
    () => buildSlotsForDate(selectedBarber?.schedule, date),
    [selectedBarber?.schedule, date],
  );
  const daySchedule = useMemo(
    () => getDaySchedule(selectedBarber?.schedule, date),
    [selectedBarber?.schedule, date],
  );
  const dayOptions = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 10 }).map((_, i) => {
      const d = addDays(base, i);
      return {
        iso: toISODate(d),
        wd: mnWeekdayShort(d),
        dd: d.getDate().toString().padStart(2, "0"),
        mm: (d.getMonth() + 1).toString().padStart(2, "0"),
      };
    });
  }, []);

  const step: 1 | 2 | 3 = !barberId ? 1 : !time ? 2 : 3;

  useEffect(() => {
    if (profilePrefilledRef.current || !profile) return;
    if (profile.full_name) setName(profile.full_name);
    if (profile.phone) setPhone(profile.phone);
    profilePrefilledRef.current = true;
  }, [profile]);

  useEffect(() => {
    appointmentIdRef.current = appointmentId;
  }, [appointmentId]);

  useEffect(() => {
    submittedRef.current = submitted;
  }, [submitted]);

  useEffect(() => {
    return () => {
      const id = appointmentIdRef.current;
      if (id && !submittedRef.current) {
        cancelPendingAppointmentClient(id);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedBarber) return;
    if (!isBarberWorkingOnDate(selectedBarber.schedule, date)) {
      const next = dayOptions.find((d) =>
        isBarberWorkingOnDate(selectedBarber.schedule, d.iso),
      );
      if (next && next.iso !== date) setDate(next.iso);
    }
  }, [selectedBarber, date, dayOptions]);

  useEffect(() => {
    if (!barberId) {
      setBookedTimes([]);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);

    void fetchBookedTimes(barberId, date).then((times) => {
      if (!cancelled) {
        setBookedTimes(times);
        setLoadingSlots(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [barberId, date]);

  const refreshBookedSlots = useCallback(async () => {
    if (!barberId) return;
    setLoadingSlots(true);
    const times = await fetchBookedTimes(barberId, date);
    setBookedTimes(times);
    setLoadingSlots(false);
  }, [barberId, date]);

  useEffect(() => {
    if (!appointmentId || !qpay || submitted) return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.setTimeout(() => {
      paymentTopRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    }, 0);
  }, [appointmentId, qpay, submitted]);

  useEffect(() => {
    setTotalMnt(bookingPriceMnt);
  }, [bookingPriceMnt]);

  useEffect(() => {
    if (!appointmentId || submitted) return;

    let cancelled = false;
    setPolling(true);

    const tick = async () => {
      try {
        const res = await fetch(
          apiUrl(`/api/appointments/?appointmentId=${appointmentId}`),
        );
        const data = (await res.json()) as { paid?: boolean };
        if (!cancelled && data.paid) {
          setPolling(false);
          await hapticSuccess();
          setSubmitted(true);
          if (barberId) {
            void refreshBookedSlots();
          }
        }
      } catch {
        /* retry */
      }
    };

    void tick();
    const id = window.setInterval(tick, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      setPolling(false);
    };
  }, [appointmentId, submitted, barberId, refreshBookedSlots]);

  function isSlotUnavailable(slot: string): boolean {
    if (!barberId || !selectedBarber) return true;
    if (!slots.includes(slot)) return true;
    if (isPastSlot(date, slot)) return true;
    return bookedTimes.includes(slot);
  }

  function pickBarber(id: string) {
    void hapticLight();
    setBarberId(id);
    setTime(null);
    scrollToRef(daySectionRef);
  }

  function pickDate(iso: string) {
    void hapticLight();
    setDate(iso);
    setTime(null);
    scrollToRef(timeSectionRef);
  }

  function pickTime(t: string) {
    void hapticLight();
    setTime(t);
    scrollToRef(formSectionRef);
  }

  function resetFlow() {
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError(null);
    setAppointmentId(null);
    setQpay(null);
    setPaymentRef(null);
    setTotalMnt(DEFAULT_BOOKING_PRICE_MNT);
    setPolling(false);
    setCancelling(false);
    setBarberId(null);
    setTime(null);
    setName("");
    setPhone("");
    setPromoCode("");
  }

  async function cancelPayment() {
    if (!appointmentId || cancelling) return;

    setCancelling(true);
    setPolling(false);
    const id = appointmentId;

    try {
      await fetch(apiUrl(`/api/appointments/?appointmentId=${id}`), {
        method: "DELETE",
      });
    } catch {
      /* best effort */
    }

    setAppointmentId(null);
    setQpay(null);
    setPaymentRef(null);
    setCancelling(false);
    await refreshBookedSlots();
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!barberId || !time || !name.trim() || !phone.trim() || submitting) return;
    if (isSlotUnavailable(time)) {
      setSubmitError("Сонгосон цаг боломжгүй болсон. Өөр цаг сонгоно уу.");
      setTime(null);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const res = await fetch(apiUrl("/api/appointments/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barberId,
        date,
        time,
        customerName: name,
        customerPhone: phone,
        promoCode: promoCode.trim() || undefined,
      }),
    });

    const result = (await res.json()) as {
      id?: string;
      error?: string;
      qpay?: QPayPayload;
      paymentRef?: string;
      totalMnt?: number;
    };

    setSubmitting(false);

    if (!res.ok || !result.id || !result.qpay) {
      setSubmitError(result.error ?? "Захиалга үүсгэж чадсангүй.");
      return;
    }

    setAppointmentId(result.id);
    setQpay(result.qpay);
    setPaymentRef(result.paymentRef ?? null);
    setTotalMnt(result.totalMnt ?? bookingPriceMnt);
  }

  if (appointmentId && qpay && !submitted && selectedBarber && time) {
    const qrSrc = qpay.qrImage
      ? qpay.qrImage.startsWith("data:")
        ? qpay.qrImage
        : `data:image/png;base64,${qpay.qrImage}`
      : null;

    return (
      <div
        ref={paymentTopRef}
        className="mx-auto max-w-lg scroll-mt-20 rounded-3xl border border-achira-blue/12 bg-achira-paper/70 p-5 shadow-[0_24px_80px_rgba(30,79,150,0.12)] dark:border-achira-cream/10 dark:bg-achira-blue/10 dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:max-w-xl md:p-8"
      >
        <div className="flex flex-col items-center rounded-2xl border border-achira-blue/10 bg-white/70 p-4 dark:border-achira-cream/10 dark:bg-achira-navy/40">
          {qrSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrSrc}
              alt="QPay QR"
              className="h-56 w-56 rounded-2xl border border-achira-blue/10 bg-white p-2"
            />
          ) : (
            <div className="grid h-56 w-56 place-items-center rounded-2xl border border-dashed border-achira-blue/20 text-center text-xs text-achira-blue/50">
              QR ачааллаж байна...
            </div>
          )}

          <p className="mt-4 text-lg font-semibold text-achira-blue-dark dark:text-achira-cream">
            {formatBookingPriceMnt(totalMnt)}
          </p>
          {paymentRef && (
            <p className="mt-2 font-mono text-xs text-achira-blue/55 dark:text-achira-cream/50">
              {paymentRef}
            </p>
          )}

          {polling && (
            <p className="mt-4 flex items-center gap-2 text-xs text-achira-blue/55 dark:text-achira-cream/50">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Төлбөр хүлээж байна...
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.28em] text-achira-blue/55 dark:text-achira-cream/50">
          QPay төлбөр
        </p>
        <h2 className="mt-2 text-center font-[family-name:var(--font-display)] text-2xl text-achira-blue-dark dark:text-achira-cream">
          Төлбөр төлнө үү
        </h2>
        <p className="mt-2 text-center text-sm text-achira-blue/65 dark:text-achira-cream/60">
          <span className="font-medium text-achira-blue-dark dark:text-achira-cream">
            {selectedBarber.name}
          </span>{" "}
          — {date} {time}
        </p>

        {qpay.urls.length > 0 && (
          <ul className="mt-5 max-h-48 space-y-2 overflow-y-auto">
            {qpay.urls.slice(0, 6).map((bank) => (
              <li key={bank.link}>
                <a
                  href={bank.link}
                  className="flex items-center gap-3 rounded-2xl border border-achira-blue/10 px-3 py-2.5 text-sm text-achira-blue-dark transition-colors hover:bg-achira-blue/5 dark:border-achira-cream/10 dark:text-achira-cream dark:hover:bg-achira-cream/5"
                >
                  {bank.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bank.logo} alt="" className="h-8 w-8 rounded-lg object-contain" />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-achira-blue/10 text-[10px] font-bold">
                      {bank.name.slice(0, 2)}
                    </span>
                  )}
                  <span>{bank.description || bank.name}</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-center text-xs text-achira-blue/55 dark:text-achira-cream/50">
          Төлбөр амжилттай болсны дараа л захиалга баталгаажна.
        </p>
        <button
          type="button"
          onClick={() => void cancelPayment()}
          disabled={cancelling}
          className="mt-4 w-full text-center text-sm text-achira-blue/55 underline-offset-4 hover:underline disabled:opacity-50 dark:text-achira-cream/50"
        >
          {cancelling ? "Цуцлаж байна..." : "Төлбөр төлөхгүй буцах"}
        </button>
      </div>
    );
  }

  if (submitted && selectedBarber && time) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-achira-blue/12 bg-achira-paper/70 p-7 text-center shadow-[0_24px_80px_rgba(30,79,150,0.12)] dark:border-achira-cream/10 dark:bg-achira-blue/10 dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:max-w-xl md:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-achira-blue/10 text-achira-blue dark:bg-achira-cream/10 dark:text-achira-cream">
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-achira-blue/55 dark:text-achira-cream/50">
          Амжилттай
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-achira-blue-dark dark:text-achira-cream">
          Баярлалаа
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-achira-blue/70 dark:text-achira-cream/65">
          <span className="font-medium text-achira-blue-dark dark:text-achira-cream">
            {selectedBarber.name}
          </span>{" "}
          babert{" "}
          <span className="font-medium">{date}</span> өдөр{" "}
          <span className="font-medium">{time}</span> цагт захиалга амжилттай
          баталгаажлаа.
        </p>
        {phone.trim() && (
          <p className="mt-3 text-xs leading-relaxed text-achira-blue/55 dark:text-achira-cream/50">
            Баталгаажуулалтын SMS таны{" "}
            <span className="font-medium">{phone}</span> дугаар руу илгээгдлээ.
          </p>
        )}
        <button
          type="button"
          onClick={resetFlow}
          className="mt-7 rounded-2xl bg-achira-blue px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
        >
          Шинэ захиалга
        </button>
      </div>
    );
  }

  const sectionTitle =
    "text-[10px] font-medium uppercase tracking-[0.32em] text-achira-blue/55 dark:text-achira-cream/50";
  const sectionHeading =
    "mt-1 font-[family-name:var(--font-display)] text-[18px] tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream";
  const sectionHint = "mt-2 text-[11px] leading-relaxed text-achira-blue/60 dark:text-achira-cream/55";

  return (
    <div className="mx-auto w-full max-w-5xl pb-28 md:pb-0">
      <Stepper step={step} />

      {/* Mobile */}
      <div className="space-y-7 md:hidden">
        <section>
          <div className="mb-3 flex items-end justify-between px-0.5">
            <div>
              <p className={sectionTitle}>1. Бабер</p>
              <h2 className={sectionHeading}>Baber сонгох</h2>
              <p className={sectionHint}>Та үйлчлүүлэх бабераа сонгоно уу.</p>
            </div>
            {barberId && (
              <button
                type="button"
                onClick={() => {
                  setBarberId(null);
                  setTime(null);
                }}
                className="text-[10px] uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50"
              >
                Солих
              </button>
            )}
          </div>

          <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex snap-x snap-mandatory gap-3">
              {barbers.map((b) => {
                const active = barberId === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => pickBarber(b.id)}
                    className={`relative w-[72%] max-w-[16.5rem] shrink-0 snap-center overflow-hidden rounded-[1.1rem] border text-left shadow-[0_12px_40px_rgba(30,79,150,0.12)] transition-all active:scale-[0.98] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${
                      active
                        ? "border-2 border-achira-blue dark:border-achira-cream"
                        : barberId
                          ? "border-achira-blue/10 opacity-55 dark:border-achira-cream/10"
                          : "border-achira-blue/10 dark:border-achira-cream/10"
                    }`}
                  >
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={b.imageUrl}
                        alt={b.name}
                        fill
                        className={`object-cover transition-transform duration-300 ${active ? "scale-105" : ""}`}
                        sizes="65vw"
                        priority={active}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-achira-navy/85 via-achira-navy/20 to-transparent" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-2.5">
                      <div className="rounded-2xl border border-white/15 bg-black/25 px-3 py-2.5 backdrop-blur-md">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] ${
                            active
                              ? "border-achira-cream/40 bg-achira-cream/15 text-achira-cream"
                              : "border-white/20 text-white/70"
                          }`}
                        >
                          {active ? "Сонгогдсон" : "Сонгох"}
                        </span>
                        <p className="mt-1.5 truncate font-[family-name:var(--font-display)] text-sm text-white">
                          {b.name}
                        </p>
                        <p className="truncate text-[11px] text-white/75">{b.title}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section
          ref={daySectionRef}
          className={`scroll-mt-24 transition-opacity ${barberId ? "opacity-100" : "pointer-events-none opacity-40"}`}
        >
          <div className="mb-3 px-0.5">
            <p className={sectionTitle}>2. Өдөр</p>
            <h2 className={sectionHeading}>Өдөр сонгох</h2>
            <p className={sectionHint}>Долоо хоногийн өдрөөс сонгоно уу.</p>
          </div>
          <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex snap-x snap-mandatory gap-2">
              {dayOptions.map((d) => {
                const active = d.iso === date;
                const dayOff =
                  !!selectedBarber &&
                  !isBarberWorkingOnDate(selectedBarber.schedule, d.iso);
                return (
                  <button
                    key={d.iso}
                    type="button"
                    disabled={!barberId || dayOff}
                    onClick={() => pickDate(d.iso)}
                    className={`shrink-0 snap-start rounded-2xl border px-3 py-2 text-left transition-all active:scale-[0.98] ${
                      dayOff
                        ? "cursor-not-allowed border-transparent bg-achira-blue/5 text-achira-blue/30 line-through dark:bg-achira-cream/5 dark:text-achira-cream/30"
                        : active
                        ? "border-achira-blue bg-achira-blue text-achira-cream dark:border-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                        : "border-achira-blue/12 bg-white/70 text-achira-blue-dark dark:border-achira-cream/12 dark:bg-achira-navy/50 dark:text-achira-cream"
                    }`}
                  >
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] opacity-70">
                      {d.wd}
                    </p>
                    <p className="mt-0.5 font-[family-name:var(--font-display)] text-sm">
                      {d.dd}
                    </p>
                    <p className="text-[9px] tabular-nums opacity-70">{d.mm}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section
          ref={timeSectionRef}
          className={`scroll-mt-24 transition-opacity ${barberId ? "opacity-100" : "pointer-events-none opacity-40"}`}
        >
          <div className="mb-3 px-0.5">
            <p className={sectionTitle}>3. Цаг</p>
            <h2 className={sectionHeading}>Цаг сонгох</h2>
            <p className={sectionHint}>
              {daySchedule.off
                ? "Энэ өдөр бабер ажиллахгүй."
                : `${daySchedule.start.toString().padStart(2, "0")}:00 — ${daySchedule.end.toString().padStart(2, "0")}:00, 1 цагийн зайтай.`}
            </p>
          </div>
          <div className="rounded-2xl border border-achira-blue/10 bg-white/60 p-3 dark:border-achira-cream/10 dark:bg-achira-navy/40">
            {loadingSlots ? (
              <p className="py-6 text-center text-xs text-achira-blue/55 dark:text-achira-cream/50">
                Цаг шалгаж байна...
              </p>
            ) : slots.length === 0 ? (
              <p className="py-6 text-center text-xs text-achira-blue/55 dark:text-achira-cream/50">
                Энэ өдөр боломжит цаг байхгүй.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((t) => {
                  const unavailable = isSlotUnavailable(t);
                  const active = time === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={!barberId || unavailable}
                      onClick={() => pickTime(t)}
                      className={`rounded-xl border py-2.5 text-[12px] font-medium transition-all active:scale-[0.98] ${
                        unavailable
                          ? "cursor-not-allowed border-transparent bg-achira-blue/5 text-achira-blue/30 line-through dark:bg-achira-cream/5 dark:text-achira-cream/30"
                          : active
                            ? "border-achira-blue bg-achira-blue text-achira-cream dark:border-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                            : "border-achira-blue/12 bg-achira-cream/50 text-achira-blue-dark dark:border-achira-cream/12 dark:bg-achira-navy/50 dark:text-achira-cream"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {barberId && time && (
          <section ref={formSectionRef} className="scroll-mt-24 pt-1">
            <div className="rounded-2xl border border-achira-blue/10 bg-achira-paper/60 p-4 dark:border-achira-cream/10 dark:bg-achira-blue/10">
              <p className="text-[11px] text-achira-blue/60 dark:text-achira-cream/55">
                Баталгаажуулахын тулд мэдээллээ үлдээнэ үү. Урьдчилсан төлбөр:{" "}
                <span className="font-medium text-achira-blue-dark dark:text-achira-cream">
                  {formatBookingPriceMnt(bookingPriceMnt)}
                </span>
              </p>
              <form onSubmit={handleConfirm} className="mt-4 space-y-3">
                <div>
                  <label className="text-[9px] font-medium uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50">
                    Нэр
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-achira-blue/12 bg-white/90 px-4 py-3 text-base text-achira-ink outline-none focus:border-achira-blue/30 dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
                    placeholder="Таны нэр"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-medium uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50">
                    Утас
                  </label>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-achira-blue/12 bg-white/90 px-4 py-3 text-base text-achira-ink outline-none focus:border-achira-blue/30 dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
                    placeholder="99112233"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-medium uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50">
                    Промо код (заавал биш)
                  </label>
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="mt-1 w-full rounded-2xl border border-achira-blue/12 bg-white/90 px-4 py-3 text-base uppercase text-achira-ink outline-none focus:border-achira-blue/30 dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
                    placeholder=""
                  />
                </div>
                {submitError && (
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-achira-blue py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-achira-cream active:scale-[0.98] disabled:opacity-60 dark:bg-achira-cream dark:text-achira-blue-dark"
                >
                  {submitting ? "Илгээж байна..." : "Төлбөр төлөх"}
                  <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </form>
            </div>
          </section>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-12 xl:gap-16">
          {/* Left — barber + date */}
          <div className="space-y-10">
            <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className={sectionTitle}>1. Бабер</p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream lg:text-3xl">
                    Baber сонгох
                  </h2>
                  <p className="mt-2 text-sm text-achira-blue/60 dark:text-achira-cream/55">
                    Та үйлчлүүлэх бабераа сонгоно уу.
                  </p>
                </div>
                {barberId && (
                  <button
                    type="button"
                    onClick={() => {
                      setBarberId(null);
                      setTime(null);
                    }}
                    className="rounded-full border border-achira-blue/12 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-achira-blue/60 transition-colors hover:border-achira-blue/25 hover:text-achira-blue-dark dark:border-achira-cream/12 dark:text-achira-cream/55 dark:hover:border-achira-cream/25 dark:hover:text-achira-cream"
                  >
                    Солих
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {barbers.map((b) => {
                  const active = barberId === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => pickBarber(b.id)}
                      className={`group relative overflow-hidden rounded-2xl border text-left shadow-[0_12px_40px_rgba(30,79,150,0.08)] transition-all hover:shadow-[0_16px_48px_rgba(30,79,150,0.14)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] ${
                        active
                          ? "border-2 border-achira-blue ring-4 ring-achira-blue/10 dark:border-achira-cream dark:ring-achira-cream/10"
                          : "border-achira-blue/10 hover:border-achira-blue/25 dark:border-achira-cream/10 dark:hover:border-achira-cream/25"
                      }`}
                    >
                      <div className="relative aspect-[5/4] overflow-hidden">
                        <Image
                          src={b.imageUrl}
                          alt={b.name}
                          fill
                          className={`object-cover transition-transform duration-500 ${active ? "scale-105" : "group-hover:scale-[1.03]"}`}
                          sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-achira-navy/90 via-achira-navy/25 to-transparent" />
                        {active && (
                          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-achira-cream text-achira-blue-dark shadow-lg">
                            <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] ${
                            active
                              ? "border-achira-cream/40 bg-achira-cream/15 text-achira-cream"
                              : "border-white/20 text-white/70"
                          }`}
                        >
                          {active ? "Сонгогдсон" : "Сонгох"}
                        </span>
                        <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-white">
                          {b.name}
                        </p>
                        <p className="text-sm text-white/75">{b.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section
              className={`transition-opacity ${barberId ? "opacity-100" : "pointer-events-none opacity-40"}`}
            >
              <div className="mb-5">
                <p className={sectionTitle}>2. Өдөр</p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream">
                  Өдөр сонгох
                </h2>
                <p className="mt-2 text-sm text-achira-blue/60 dark:text-achira-cream/55">
                  Дараагийн 10 өдрөөс сонгоно уу.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {dayOptions.map((d) => {
                  const active = d.iso === date;
                  const dayOff =
                    !!selectedBarber &&
                    !isBarberWorkingOnDate(selectedBarber.schedule, d.iso);
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      disabled={!barberId || dayOff}
                      onClick={() => pickDate(d.iso)}
                      className={`min-w-[4.5rem] rounded-2xl border px-4 py-3 text-center transition-all ${
                        dayOff
                          ? "cursor-not-allowed border-transparent bg-achira-blue/5 text-achira-blue/30 line-through dark:bg-achira-cream/5 dark:text-achira-cream/30"
                          : active
                          ? "border-achira-blue bg-achira-blue text-achira-cream shadow-[0_8px_24px_rgba(30,79,150,0.25)] dark:border-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                          : "border-achira-blue/12 bg-white/70 text-achira-blue-dark hover:border-achira-blue/25 dark:border-achira-cream/12 dark:bg-achira-navy/50 dark:text-achira-cream dark:hover:border-achira-cream/25"
                      }`}
                    >
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-70">
                        {d.wd}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-display)] text-lg">
                        {d.dd}
                      </p>
                      <p className="text-[10px] tabular-nums opacity-70">{d.mm}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right — sticky booking panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-achira-blue/12 bg-achira-paper/70 shadow-[0_20px_60px_rgba(30,79,150,0.1)] backdrop-blur-sm dark:border-achira-cream/10 dark:bg-achira-blue/10 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              {selectedBarber ? (
                <div className="flex items-center gap-3 border-b border-achira-blue/10 bg-achira-blue/5 px-5 py-4 dark:border-achira-cream/10 dark:bg-achira-cream/5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={selectedBarber.imageUrl}
                      alt={selectedBarber.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-achira-blue-dark dark:text-achira-cream">
                      {selectedBarber.name}
                    </p>
                    <p className="truncate text-xs text-achira-blue/60 dark:text-achira-cream/55">
                      {selectedBarber.title}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 border-b border-achira-blue/10 px-5 py-4 dark:border-achira-cream/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-achira-blue/8 text-achira-blue/40 dark:bg-achira-cream/8 dark:text-achira-cream/40">
                    <User className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-achira-blue/55 dark:text-achira-cream/50">
                    Эхлээд бабер сонгоно уу
                  </p>
                </div>
              )}

              <div className="p-5 sm:p-6">
                <div className="mb-1 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-achira-blue/50 dark:text-achira-cream/45" strokeWidth={1.5} />
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-achira-blue/55 dark:text-achira-cream/50">
                    3. Цаг сонгох
                  </p>
                </div>
                <p className="text-xs text-achira-blue/55 dark:text-achira-cream/50">
                  {daySchedule.off
                    ? "Ажиллахгүй"
                    : `${daySchedule.start.toString().padStart(2, "0")}:00 — ${daySchedule.end.toString().padStart(2, "0")}:00`}
                </p>

                <div className="mt-4 rounded-2xl border border-achira-blue/8 bg-white/50 p-3 dark:border-achira-cream/8 dark:bg-achira-navy/40">
                  {!barberId ? (
                    <p className="py-8 text-center text-sm text-achira-blue/45 dark:text-achira-cream/40">
                      Бабер сонгосны дараа цагууд харагдана
                    </p>
                  ) : loadingSlots ? (
                    <p className="py-8 text-center text-sm text-achira-blue/55 dark:text-achira-cream/50">
                      Цаг шалгаж байна...
                    </p>
                  ) : slots.length === 0 ? (
                    <p className="py-8 text-center text-sm text-achira-blue/55 dark:text-achira-cream/50">
                      Энэ өдөр боломжит цаг байхгүй.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((t) => {
                        const unavailable = isSlotUnavailable(t);
                        const active = time === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={unavailable}
                            onClick={() => pickTime(t)}
                            className={`rounded-xl border py-2.5 text-sm font-medium transition-all hover:scale-[1.02] ${
                              unavailable
                                ? "cursor-not-allowed border-transparent bg-achira-blue/5 text-achira-blue/30 line-through dark:bg-achira-cream/5 dark:text-achira-cream/30"
                                : active
                                  ? "border-achira-blue bg-achira-blue text-achira-cream shadow-[0_4px_16px_rgba(30,79,150,0.3)] dark:border-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                                  : "border-achira-blue/12 bg-achira-cream/60 text-achira-blue-dark hover:border-achira-blue/25 dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream dark:hover:border-achira-cream/25"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {barberId && time && (
                  <>
                    <div className="mt-5 rounded-2xl border border-achira-blue/10 bg-achira-blue/5 px-4 py-3 dark:border-achira-cream/10 dark:bg-achira-cream/5">
                      <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-achira-blue/50 dark:text-achira-cream/45">
                        Захиалгын дэлгэрэнгүй
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-achira-blue-dark dark:text-achira-cream">
                        <p>
                          <span className="text-achira-blue/55 dark:text-achira-cream/50">Өдөр:</span>{" "}
                          {date}
                        </p>
                        <p>
                          <span className="text-achira-blue/55 dark:text-achira-cream/50">Цаг:</span>{" "}
                          {time}
                        </p>
                        <p>
                          <span className="text-achira-blue/55 dark:text-achira-cream/50">Төлбөр:</span>{" "}
                          {formatBookingPriceMnt(bookingPriceMnt)}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleConfirm} className="mt-5 space-y-4">
                      <div>
                        <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50">
                          Нэр
                        </label>
                        <input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-achira-blue/12 bg-white/90 px-4 py-3 text-sm text-achira-ink outline-none transition-colors focus:border-achira-blue/30 focus:ring-2 focus:ring-achira-blue/10 dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream dark:focus:border-achira-cream/30 dark:focus:ring-achira-cream/10"
                          placeholder="Таны нэр"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50">
                          Утас
                        </label>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-achira-blue/12 bg-white/90 px-4 py-3 text-sm text-achira-ink outline-none transition-colors focus:border-achira-blue/30 focus:ring-2 focus:ring-achira-blue/10 dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream dark:focus:border-achira-cream/30 dark:focus:ring-achira-cream/10"
                          placeholder="99112233"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50">
                          Промо код (заавал биш)
                        </label>
                        <input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          className="mt-1.5 w-full rounded-xl border border-achira-blue/12 bg-white/90 px-4 py-3 text-sm uppercase text-achira-ink outline-none transition-colors focus:border-achira-blue/30 dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
                          placeholder=""
                        />
                      </div>
                      {submitError && (
                        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                          {submitError}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-achira-blue py-4 text-xs font-semibold uppercase tracking-[0.28em] text-achira-cream shadow-[0_8px_32px_rgba(30,79,150,0.25)] transition-all hover:bg-achira-blue-dark hover:scale-[1.01] disabled:opacity-60 dark:bg-achira-cream dark:text-achira-blue-dark dark:shadow-[0_8px_32px_rgba(245,240,232,0.15)] dark:hover:bg-achira-paper"
                      >
                        {submitting ? "Илгээж байна..." : "Төлбөр төлөх"}
                        <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
