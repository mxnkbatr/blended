"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  adminDeleteAppointment,
  adminFetchAppointments,
  adminFetchBarbers,
  adminUpdateAppointment,
  type AppointmentRow,
  type BarberRow,
} from "@/lib/supabase/admin-crud";
import {
  APPOINTMENT_STATUS_LABELS,
  labelStatus,
} from "@/lib/admin-labels";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { useAdminAutoRefresh } from "@/hooks/useAdminAutoRefresh";
import { hapticSuccess } from "@/lib/haptics";

const STATUSES = [
  "AWAITING_PAYMENT",
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
  const [barbers, setBarbers] = useState<BarberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const barberMap = Object.fromEntries(barbers.map((b) => [b.id, b.name]));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [appointments, barberRows] = await Promise.all([
        adminFetchAppointments(),
        adminFetchBarbers(),
      ]);
      setRows(appointments);
      setBarbers(barberRows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useAdminAutoRefresh(load);

  const visible =
    filter === "ALL" ? rows : rows.filter((r) => r.status === filter);

  async function changeStatus(id: string, status: string) {
    setSuccess(null);
    try {
      await adminUpdateAppointment(id, { status });
      setSuccess("Төлөв шинэчлэгдлээ.");
      await hapticSuccess();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа");
    }
  }

  async function saveNotes(id: string, notes: string) {
    setSuccess(null);
    try {
      await adminUpdateAppointment(id, { notes });
      setSuccess("Тэмдэглэл хадгалагдлаа.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Устгах уу?")) return;
    try {
      await adminDeleteAppointment(id);
      setSuccess("Устгагдлаа.");
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
        {visible.length} / {rows.length} захиалга
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              filter === s
                ? "border-achira-blue bg-achira-blue text-achira-cream dark:border-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                : "border-achira-blue/12 text-achira-blue/60 dark:border-achira-cream/12 dark:text-achira-cream/55"
            }`}
          >
            {s === "ALL" ? "Бүгд" : labelStatus(APPOINTMENT_STATUS_LABELS, s)}
          </button>
        ))}
      </div>

      <AdminFeedback success={success} error={error} />

      {loading ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-achira-blue/5" />
      ) : visible.length === 0 ? (
        <p className="mt-8 text-sm text-achira-blue/55 dark:text-achira-cream/50">
          Захиалга байхгүй.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((row) => (
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
                    {formatDt(row.starts_at)} ·{" "}
                    {barberMap[row.barber_id] ?? row.barber_id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(row.id)}
                  className="rounded-lg border border-rose-200 p-2 text-rose-600 dark:border-rose-900/40 dark:text-rose-400"
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
                      {labelStatus(APPOINTMENT_STATUS_LABELS, s)}
                    </option>
                  ))}
                </select>
              </div>
              <label className="mt-3 block text-xs text-achira-blue/50 dark:text-achira-cream/45">
                Тэмдэглэл
                <textarea
                  defaultValue={row.notes ?? ""}
                  rows={2}
                  onBlur={(e) => {
                    const next = e.target.value.trim();
                    if (next !== (row.notes ?? "")) {
                      void saveNotes(row.id, next);
                    }
                  }}
                  className="admin-input mt-1 resize-none"
                  placeholder="Нэмэлт мэдээлэл..."
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
