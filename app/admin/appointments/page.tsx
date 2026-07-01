"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  adminDeleteAppointment,
  adminFetchAppointments,
  adminUpdateAppointment,
  type AppointmentRow,
} from "@/lib/supabase/admin-crud";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
] as const;

function formatDt(iso: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ulaanbaatar",
  }).format(new Date(iso));
}

export default function AdminAppointmentsPage() {
  const [rows, setRows] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await adminFetchAppointments());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeStatus(id: string, status: string) {
    try {
      await adminUpdateAppointment(id, { status });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Устгах уу?")) return;
    try {
      await adminDeleteAppointment(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа");
    }
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-xl text-achira-blue-dark dark:text-achira-cream">
        Цаг захиалга
      </h2>
      <p className="mt-1 text-sm text-achira-blue/55 dark:text-achira-cream/50">
        Сүүлийн {rows.length} захиалга
      </p>

      {error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-achira-blue/5" />
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-achira-blue/55 dark:text-achira-cream/50">
          Захиалга байхгүй.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-achira-blue/10 bg-white/60 p-4 dark:border-achira-cream/10 dark:bg-achira-navy/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-achira-blue-dark dark:text-achira-cream">
                    {row.customer_name} · {row.customer_phone}
                  </p>
                  <p className="mt-1 text-sm text-achira-blue/60 dark:text-achira-cream/55">
                    {formatDt(row.starts_at)} · Baber {row.barber_id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(row.id)}
                  className="rounded-lg border border-rose-200 p-2 text-rose-600"
                  aria-label="Устгах"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-achira-blue/50">Төлөв:</span>
                <select
                  value={row.status}
                  onChange={(e) => void changeStatus(row.id, e.target.value)}
                  className="rounded-lg border border-achira-blue/12 bg-white px-2 py-1 text-sm dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
