"use client";

import { useCallback, useEffect, useState } from "react";
import { Phone, Trash2, User } from "lucide-react";
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
  appointmentStatusTone,
  labelStatus,
} from "@/lib/admin-labels";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
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

  const counts = STATUSES.reduce(
    (acc, s) => {
      acc[s] = rows.filter((r) => r.status === s).length;
      return acc;
    },
    {} as Record<string, number>,
  );

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
      <AdminPageHeader
        title="Цаг захиалга"
        description="Төлбөрийн төлөв, барбер, огноог эндээс удирдана. Шүүлтүүрээр яаралтайг түрүүлж харна."
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
            filter === "ALL"
              ? "border-achira-blue bg-achira-blue text-achira-cream dark:border-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
              : "border-achira-blue/12 text-achira-blue/60 dark:border-achira-cream/12 dark:text-achira-cream/55"
          }`}
        >
          Бүгд ({rows.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
              filter === s
                ? "border-achira-blue bg-achira-blue text-achira-cream dark:border-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                : "border-achira-blue/12 text-achira-blue/60 dark:border-achira-cream/12 dark:text-achira-cream/55"
            }`}
          >
            {labelStatus(APPOINTMENT_STATUS_LABELS, s)} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <AdminFeedback success={success} error={error} className="mt-4" />

      {loading ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-achira-blue/5" />
      ) : visible.length === 0 ? (
        <p className="mt-8 text-sm text-achira-blue/55 dark:text-achira-cream/50">
          Энэ шүүлтүүрт захиалга байхгүй.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-achira-gold/15 bg-white/65 p-4 dark:border-achira-cream/10 dark:bg-achira-navy/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminStatusBadge
                      label={labelStatus(APPOINTMENT_STATUS_LABELS, row.status)}
                      tone={appointmentStatusTone(row.status)}
                    />
                    {row.qpay_invoice_id &&
                    row.status !== "AWAITING_PAYMENT" &&
                    row.status !== "CANCELLED" ? (
                      <AdminStatusBadge label="QPay төлсөн" tone="success" />
                    ) : null}
                  </div>
                  <p className="mt-2.5 font-[family-name:var(--font-display)] text-lg text-achira-blue-dark dark:text-achira-cream">
                    {formatDt(row.starts_at)}
                  </p>
                  <p className="mt-1 text-sm text-achira-blue/65 dark:text-achira-cream/60">
                    Барбер:{" "}
                    <span className="font-medium text-achira-blue-dark dark:text-achira-cream">
                      {barberMap[row.barber_id] ?? "Тодорхойгүй"}
                    </span>
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

              <div className="mt-3 grid gap-2 rounded-xl border border-achira-blue/8 bg-achira-paper/40 px-3 py-2.5 text-sm dark:border-achira-cream/8 dark:bg-achira-blue/10 sm:grid-cols-2">
                <p className="flex items-center gap-2 text-achira-blue-dark dark:text-achira-cream">
                  <User className="h-3.5 w-3.5 shrink-0 opacity-50" />
                  {row.customer_name}
                </p>
                <p className="flex items-center gap-2 text-achira-blue-dark dark:text-achira-cream">
                  <Phone className="h-3.5 w-3.5 shrink-0 opacity-50" />
                  <a href={`tel:${row.customer_phone}`} className="underline-offset-2 hover:underline">
                    {row.customer_phone}
                  </a>
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="text-xs text-achira-blue/50 dark:text-achira-cream/45">
                  Төлөв солих
                </label>
                <select
                  value={row.status}
                  onChange={(e) => void changeStatus(row.id, e.target.value)}
                  className="rounded-lg border border-achira-blue/12 bg-white px-2.5 py-1.5 text-sm dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
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
