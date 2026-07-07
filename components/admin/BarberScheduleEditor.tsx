"use client";

import {
  DAY_LABELS,
  defaultBarberSchedule,
  formatWorkHours,
  type BarberSchedule,
  type DayKey,
} from "@/lib/barbers/schedule";

const HOURS = Array.from({ length: 17 }, (_, i) => i + 7);

type Props = {
  value: BarberSchedule;
  onChange: (schedule: BarberSchedule) => void;
};

export function BarberScheduleEditor({ value, onChange }: Props) {
  const schedule = value ?? defaultBarberSchedule();

  function updateDay(key: DayKey, patch: Partial<BarberSchedule[DayKey]>) {
    onChange({
      ...schedule,
      [key]: { ...schedule[key], ...patch },
    });
  }

  return (
    <div className="admin-schedule">
      <div>
        <p className="admin-label">Ажлын цагийн хуваарь</p>
        <p className="mt-1 text-xs leading-relaxed text-achira-blue/50 dark:text-achira-cream/45">
          Аль өдөр амарна, хэдээс хэд хүртэл ажиллахыг тохируулна. Захиалга зөвхөн
          энэ цагийн хооронд нээгдэнэ.
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {DAY_LABELS.map(({ key, label, short }) => {
          const day = schedule[key];
          return (
            <div key={key} className="admin-schedule-row">
              <div className="flex min-w-[4.5rem] flex-col">
                <span className="text-sm font-medium text-achira-blue-dark dark:text-achira-cream">
                  {label}
                </span>
                <span className="text-[11px] text-achira-blue/45 dark:text-achira-cream/40">
                  {short}
                </span>
              </div>

              <label className="flex items-center gap-2 text-sm text-achira-blue/70 dark:text-achira-cream/65">
                <input
                  type="checkbox"
                  checked={day.off}
                  onChange={(e) => updateDay(key, { off: e.target.checked })}
                />
                Амарна
              </label>

              {!day.off ? (
                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  <select
                    value={day.start}
                    onChange={(e) =>
                      updateDay(key, { start: Number(e.target.value) })
                    }
                    className="admin-input !w-auto min-w-[5.5rem]"
                  >
                    {HOURS.map((h) => (
                      <option key={`${key}-s-${h}`} value={h}>
                        {h.toString().padStart(2, "0")}:00
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-achira-blue/45">—</span>
                  <select
                    value={day.end}
                    onChange={(e) =>
                      updateDay(key, { end: Number(e.target.value) })
                    }
                    className="admin-input !w-auto min-w-[5.5rem]"
                  >
                    {HOURS.filter((h) => h > day.start).map((h) => (
                      <option key={`${key}-e-${h}`} value={h}>
                        {h.toString().padStart(2, "0")}:00
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-xs text-achira-blue/45 sm:ml-auto dark:text-achira-cream/40">
                  {formatWorkHours(day)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
