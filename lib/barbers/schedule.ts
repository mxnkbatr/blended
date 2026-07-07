export type DayKey = "0" | "1" | "2" | "3" | "4" | "5" | "6";

export type DaySchedule = {
  off: boolean;
  start: number;
  end: number;
};

export type BarberSchedule = Record<DayKey, DaySchedule>;

export const DAY_LABELS: { key: DayKey; short: string; label: string }[] = [
  { key: "0", short: "Ня", label: "Ням" },
  { key: "1", short: "Да", label: "Даваа" },
  { key: "2", short: "Мя", label: "Мягмар" },
  { key: "3", short: "Лх", label: "Лхагва" },
  { key: "4", short: "Пү", label: "Пүрэв" },
  { key: "5", short: "Ба", label: "Баасан" },
  { key: "6", short: "Бя", label: "Бямба" },
];

const TZ = "Asia/Ulaanbaatar";

function defaultDay(off = false): DaySchedule {
  return { off, start: 10, end: 22 };
}

export function defaultBarberSchedule(): BarberSchedule {
  return {
    "0": defaultDay(true),
    "1": defaultDay(false),
    "2": defaultDay(false),
    "3": defaultDay(false),
    "4": defaultDay(false),
    "5": defaultDay(false),
    "6": defaultDay(false),
  };
}

function clampHour(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(23, Math.max(0, Math.round(n)));
}

export function normalizeBarberSchedule(raw: unknown): BarberSchedule {
  const base = defaultBarberSchedule();
  if (!raw || typeof raw !== "object") return base;

  const input = raw as Record<string, Partial<DaySchedule>>;
  for (const { key } of DAY_LABELS) {
    const day = input[key];
    if (!day) continue;
    const start = clampHour(day.start, base[key].start);
    let end = clampHour(day.end, base[key].end);
    if (end <= start) end = Math.min(24, start + 1);
    base[key] = {
      off: Boolean(day.off),
      start,
      end,
    };
  }
  return base;
}

export function getDayKeyFromDate(date: string): DayKey {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
  }).format(new Date(`${date}T12:00:00+08:00`));

  const map: Record<string, DayKey> = {
    Sun: "0",
    Mon: "1",
    Tue: "2",
    Wed: "3",
    Thu: "4",
    Fri: "5",
    Sat: "6",
  };
  return map[weekday] ?? "1";
}

export function getDaySchedule(
  schedule: BarberSchedule | null | undefined,
  date: string,
): DaySchedule {
  const normalized = normalizeBarberSchedule(schedule);
  return normalized[getDayKeyFromDate(date)];
}

export function isBarberWorkingOnDate(
  schedule: BarberSchedule | null | undefined,
  date: string,
): boolean {
  return !getDaySchedule(schedule, date).off;
}

export function buildSlotsForDate(
  schedule: BarberSchedule | null | undefined,
  date: string,
): string[] {
  const day = getDaySchedule(schedule, date);
  if (day.off) return [];

  const slots: string[] = [];
  for (let h = day.start; h < day.end; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return slots;
}

export function formatWorkHours(day: DaySchedule): string {
  if (day.off) return "Амарна";
  return `${day.start.toString().padStart(2, "0")}:00 — ${day.end.toString().padStart(2, "0")}:00`;
}

export function isSlotWithinSchedule(
  schedule: BarberSchedule | null | undefined,
  date: string,
  time: string,
): boolean {
  return buildSlotsForDate(schedule, date).includes(time);
}
