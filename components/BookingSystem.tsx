"use client";

import Image from "next/image";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { barbers } from "@/lib/data/barbers";

const OPEN_HOUR = 10;
const CLOSE_HOUR = 22;

function buildSlots(): string[] {
  const slots: string[] = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return slots;
}

/** Жишээ: тодорхой babert + цаг аль хэдийн захиалгатай гэж үзнэ */
function isBooked(barberId: string, date: string, time: string): boolean {
  const seed = `${barberId}-${date}-${time}`;
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
  // Даваа, Мягмар, Лхагва, Пүрэв, Баасан, Бямба, Ням
  return ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"][d.getDay()];
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const pct = step === 1 ? 34 : step === 2 ? 67 : 100;
  const label =
    step === 1 ? "Baber сонгох" : step === 2 ? "Өдөр сонгох" : "Цаг сонгох";

  return (
    <div
      className="mb-5 rounded-2xl border border-white/10 bg-zinc-900/25 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md md:mb-8"
      role="group"
      aria-label="Захиалгын алхам"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-zinc-600">
          Алхам {step} / 3
        </p>
        <p className="truncate text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          {label}
        </p>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full max-w-full rounded-full bg-white/30 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function BookingSystem() {
  const slots = useMemo(() => buildSlots(), []);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [date, setDate] = useState(() => toISODate(new Date()));
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const daySectionRef = useRef<HTMLDivElement | null>(null);

  const selectedBarber = barbers.find((b) => b.id === barberId);
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

  function resetFlow() {
    setSubmitted(false);
    setTime(null);
    setName("");
    setPhone("");
  }

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!barberId || !time || !name.trim() || !phone.trim()) return;
    setSubmitted(true);
  }

  if (submitted && selectedBarber && time) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-zinc-950/60 p-7 text-center shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-600">
          Амжилттай
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-normal tracking-[0.06em] text-white">
          Баярлалаа
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          <span className="text-white">{selectedBarber.name}</span> babert{" "}
          <span className="text-white">{date}</span> өдөр{" "}
          <span className="text-white">{time}</span> цагт захиалга илгээгдлээ.
          Баталгаажуулалтын дуудлага хүлээнэ үү.
        </p>
        <button
          type="button"
          onClick={resetFlow}
          className="mt-7 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white/90 backdrop-blur-md transition-colors hover:border-white/25 hover:bg-white/[0.06]"
        >
          Шинэ захиалга
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Stepper step={step} />

      {/* Mobile app-like layout */}
      <div className="space-y-6 md:hidden">
        <section>
          <div className="mb-3 flex items-end justify-between px-0.5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-600">
                1. Бабер
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-[18px] font-normal tracking-[0.08em] text-white">
                Baber сонгох
              </h2>
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
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
                className="text-[10px] uppercase tracking-[0.22em] text-zinc-600 transition-colors hover:text-zinc-400"
              >
                Солих
              </button>
            )}
          </div>

          <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex snap-x snap-mandatory gap-3">
              {barbers.map((b) => {
                const active = barberId === b.id;
                const pick = () => {
                  setBarberId(b.id);
                  setTime(null);
                };
                return (
                  <div
                    key={b.id}
                    role="button"
                    tabIndex={0}
                    onClick={pick}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        pick();
                      }
                    }}
                    className={`relative w-[72%] max-w-[16.5rem] shrink-0 snap-center cursor-pointer overflow-hidden rounded-[1.1rem] border bg-zinc-900/20 shadow-[0_14px_48px_rgba(0,0,0,0.45)] touch-manipulation transition-[transform,border-color,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] active:scale-[0.97] ${
                      active
                        ? "border-2 border-white"
                        : barberId
                          ? "border-white/10 opacity-50"
                          : "border-white/10"
                    }`}
                  >
                    {/* iOS: зураг/давхарга дээрх hit-test-ийг гаднах нэг элемент рүү татаж авах */}
                    <div className="pointer-events-none relative aspect-[4/5]">
                      <Image
                        src={b.imageUrl}
                        alt={b.name}
                        fill
                        className={`object-cover transition-transform duration-300 ease-out ${
                          active ? "scale-105" : "scale-100"
                        }`}
                        sizes="65vw"
                        priority={active}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                      <div className="flex items-end justify-between gap-2">
                        <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/[0.06] backdrop-blur-xl backdrop-saturate-150">
                          <div className="mb-1 flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] ${
                                active
                                  ? "border-white/25 bg-white/10 text-white"
                                  : "border-white/10 bg-black/20 text-zinc-400"
                              }`}
                            >
                              {active ? "Сонгогдсон" : "Сонгох"}
                            </span>
                          </div>
                          <p className="truncate font-[family-name:var(--font-display)] text-[14px] font-normal tracking-[0.04em] text-white">
                            {b.name}
                          </p>
                          <p className="mt-1 truncate text-[11px] text-zinc-300/80">
                            {b.title}
                          </p>
                        </div>
                        {active && (
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                            aria-hidden
                          >
                            <CheckCircle2 className="h-5 w-5" strokeWidth={1.6} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          ref={daySectionRef}
          className={`transition-opacity ${barberId ? "opacity-100" : "opacity-50"}`}
        >
          <div className="mb-3 flex items-end justify-between px-0.5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-600">
                2. Өдөр
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-[18px] font-normal tracking-[0.08em] text-white">
                Өдөр сонгох
              </h2>
              <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">
                Долоо хоногийн өдрөөс сонгоно уу.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex snap-x snap-mandatory gap-2">
              {dayOptions.map((d) => {
                const active = d.iso === date;
                return (
                  <button
                    key={d.iso}
                    type="button"
                    disabled={!barberId}
                    onClick={() => {
                      setDate(d.iso);
                      setTime(null);
                    }}
                    className={`shrink-0 snap-start rounded-2xl border px-3 py-2 text-left transition-[transform,colors,border-color] duration-200 active:scale-[0.98] ${
                      active
                        ? "border-white/35 bg-white/[0.08] text-white"
                        : "border-white/10 bg-zinc-900/20 text-zinc-200"
                    } ${!barberId ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                      {d.wd}
                    </p>
                    <p className="mt-0.5 font-[family-name:var(--font-display)] text-[14px] tracking-wide text-zinc-100">
                      {d.dd}
                    </p>
                    <p className="text-[9px] tabular-nums tracking-[0.18em] text-zinc-500">
                      {d.mm}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`transition-opacity ${barberId ? "opacity-100" : "opacity-50"}`}>
          <div className="mb-3 flex items-end justify-between px-0.5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-600">
                3. Цаг
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-[18px] font-normal tracking-[0.08em] text-white">
                Цаг сонгох
              </h2>
              <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">
                {OPEN_HOUR}:00 — {CLOSE_HOUR}:00, 1 цагийн зайтай.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/20 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
            <div className="grid grid-cols-3 gap-2">
              {slots.map((t) => {
                const booked = Boolean(barberId && isBooked(barberId, date, t));
                const disabled = !barberId || booked;
                const active = time === t;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={disabled}
                    onClick={() => setTime(t)}
                    className={`rounded-xl border py-2.5 text-[12px] font-medium transition-[transform,colors,border-color] duration-200 active:scale-[0.98] ${
                      booked
                        ? "cursor-not-allowed border-transparent bg-white/[0.04] text-zinc-600 line-through"
                        : active
                          ? "border-white/40 bg-white/[0.10] text-white"
                          : "border-white/10 bg-black/10 text-zinc-200 hover:border-white/20"
                    }`}
                    title={booked ? "Дүүрсэн" : t}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {barberId && time && (
          <section className="pt-1">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
              <p className="text-[11px] leading-relaxed text-zinc-500">
                Баталгаажуулахын тулд мэдээллээ үлдээнэ үү.
              </p>

              <form onSubmit={handleConfirm} className="mt-4 space-y-3">
                <div>
                  <label className="text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-600">
                    Нэр
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white outline-none backdrop-blur-md placeholder:text-zinc-600 focus:border-white/20"
                    placeholder="Таны нэр"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-600">
                    Утас
                  </label>
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white outline-none backdrop-blur-md placeholder:text-zinc-600 focus:border-white/20"
                    placeholder="99112233"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 py-3.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_36px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.65)] transition-[transform,filter,box-shadow] duration-300 ease-out active:scale-[0.98] active:from-zinc-200 active:via-zinc-100 active:to-zinc-200"
                >
                  Баталгаажуулах
                  <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </form>
            </div>
          </section>
        )}
      </div>

      {/* Mobile continue bar (replaces the global CTA on booking) */}
      <div className="pointer-events-none fixed inset-x-0 z-40 md:hidden" style={{ bottom: "calc(env(safe-area-inset-bottom) + 5.25rem)" }}>
        <div
          className="pointer-events-none absolute inset-x-0 -top-16 h-20 bg-gradient-to-t from-black/40 via-black/15 to-transparent"
          aria-hidden
        />
        <div className="pointer-events-auto px-4">
          <button
            type="button"
            disabled={!barberId}
            onClick={() => daySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className={`w-full rounded-2xl border py-3.5 text-[10px] font-semibold uppercase tracking-[0.32em] shadow-[0_12px_40px_rgba(0,0,0,0.55)] transition-[transform,background-color,border-color,color,box-shadow] duration-300 active:scale-[0.98] ${
              barberId
                ? "border-white/25 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_36px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.65)]"
                : "cursor-not-allowed border-white/10 bg-white/[0.04] text-zinc-600"
            }`}
          >
            Өдөр сонгох
          </button>
        </div>
      </div>

      {/* Desktop layout (existing) */}
      <div className="hidden md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-white sm:text-3xl">
            Baber сонгох
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Зураг, нэр, зэргийг үзэж сонгоно уу.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {barbers.map((b) => {
              const active = barberId === b.id;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setBarberId(b.id);
                      setTime(null);
                    }}
                    className={`flex w-full gap-4 rounded-2xl border p-4 text-left transition-colors ${
                      active
                        ? "border-white bg-zinc-900"
                        : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-600"
                    }`}
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                      <Image
                        src={b.imageUrl}
                        alt={b.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <span className="truncate font-medium text-white">
                        {b.name}
                      </span>
                      <span className="text-sm text-zinc-500">{b.title}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 sm:p-8">
          <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500">
            Өдөр
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setTime(null);
            }}
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
          />

          <h3 className="mt-10 text-xs font-medium uppercase tracking-widest text-zinc-500">
            Боломжит цаг ({OPEN_HOUR}:00 — {CLOSE_HOUR}:00)
          </h3>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((t) => {
              const booked = Boolean(barberId && isBooked(barberId, date, t));
              const disabled = !barberId || booked;
              const active = time === t;
              return (
                <button
                  key={t}
                  type="button"
                  disabled={disabled}
                  title={booked ? "Дүүрсэн" : t}
                  onClick={() => setTime(t)}
                  className={`rounded-xl border py-2.5 text-sm transition-colors ${
                    booked
                      ? "cursor-not-allowed border-transparent bg-zinc-900/40 text-zinc-600 line-through"
                      : active
                        ? "border-white bg-white text-black"
                        : "border-zinc-800 text-zinc-200 hover:border-zinc-500"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {!barberId && (
            <p className="mt-4 text-xs text-zinc-600">Эхлээд baber сонгоно уу.</p>
          )}

          {barberId && time && (
            <form
              onSubmit={handleConfirm}
              className="mt-10 space-y-4 border-t border-zinc-800 pt-8"
            >
              <p className="text-sm text-zinc-400">
                Захиалга баталгаажуулахын тулд холбоо барих мэдээллээ үлдээнэ үү.
              </p>
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-500">
                  Нэр
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
                  placeholder="Таны нэр"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-500">
                  Утас
                </label>
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
                  placeholder="99112233"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-white py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Баталгаажуулах
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
