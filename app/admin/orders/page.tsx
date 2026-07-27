"use client";

import { useCallback, useEffect, useState } from "react";
import { Phone, Trash2, User } from "lucide-react";
import {
  adminDeleteOrder,
  adminFetchOrders,
  adminUpdateOrderStatus,
  type AdminOrderRow,
} from "@/lib/supabase/admin-crud";
import {
  ORDER_STATUS_LABELS,
  labelStatus,
  orderStatusTone,
} from "@/lib/admin-labels";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { useAdminAutoRefresh } from "@/hooks/useAdminAutoRefresh";
import { hapticSuccess } from "@/lib/haptics";

const STATUSES = [
  "AWAITING_PAYMENT",
  "PAID",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
] as const;

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

function formatDt(iso: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ulaanbaatar",
  }).format(new Date(iso));
}

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await adminFetchOrders());
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
      await adminUpdateOrderStatus(id, status);
      setSuccess("Төлөв шинэчлэгдлээ.");
      await hapticSuccess();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Захиалгыг устгах уу?")) return;
    try {
      await adminDeleteOrder(id);
      setSuccess("Устгагдлаа.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Дэлгүүрийн захиалга"
        description="Төлбөр, бараа, хүргэлтийн төлөвийг эндээс удирдана."
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
            {labelStatus(ORDER_STATUS_LABELS, s)} ({counts[s] ?? 0})
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
                      label={labelStatus(ORDER_STATUS_LABELS, row.status)}
                      tone={orderStatusTone(row.status)}
                    />
                    {row.payment_method ? (
                      <AdminStatusBadge
                        label={row.payment_method.toUpperCase()}
                        tone="info"
                      />
                    ) : null}
                  </div>
                  <p className="mt-2.5 font-[family-name:var(--font-display)] text-xl text-achira-blue-dark dark:text-achira-cream">
                    {formatMnt(row.total_mnt)}
                  </p>
                  <p className="mt-1 text-xs text-achira-blue/50 dark:text-achira-cream/45">
                    {formatDt(row.created_at)} · #{row.id.slice(0, 8)}
                    {row.qpay_sender_invoice_no
                      ? ` · ${row.qpay_sender_invoice_no}`
                      : ""}
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
                  <a
                    href={`tel:${row.customer_phone}`}
                    className="underline-offset-2 hover:underline"
                  >
                    {row.customer_phone}
                  </a>
                </p>
              </div>

              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-achira-blue/40 dark:text-achira-cream/35">
                  Бараа
                </p>
                <ul className="mt-1.5 space-y-1 text-sm text-achira-blue/70 dark:text-achira-cream/65">
                  {row.shop_order_items?.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 border-b border-achira-blue/5 py-1.5 last:border-0 dark:border-achira-cream/5"
                    >
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="tabular-nums font-medium text-achira-blue-dark dark:text-achira-cream">
                        {formatMnt(item.unit_price_mnt * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
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
                      {labelStatus(ORDER_STATUS_LABELS, s)}
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
