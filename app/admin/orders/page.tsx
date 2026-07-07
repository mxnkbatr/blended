"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  adminDeleteOrder,
  adminFetchOrders,
  adminUpdateOrderStatus,
  type AdminOrderRow,
} from "@/lib/supabase/admin-crud";
import { ORDER_STATUS_LABELS, labelStatus } from "@/lib/admin-labels";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
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

  const visible =
    filter === "ALL" ? rows : rows.filter((r) => r.status === filter);

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
      <h2 className="font-[family-name:var(--font-display)] text-xl text-achira-blue-dark dark:text-achira-cream">
        Дэлгүүрийн захиалгууд
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
            {s === "ALL" ? "Бүгд" : labelStatus(ORDER_STATUS_LABELS, s)}
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
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-achira-blue-dark dark:text-achira-cream">
                    {formatMnt(row.total_mnt)}
                  </p>
                  <p className="mt-1 text-sm text-achira-blue/60 dark:text-achira-cream/55">
                    {row.customer_name} · {row.customer_phone}
                  </p>
                  <p className="text-xs text-achira-blue/50 dark:text-achira-cream/45">
                    {formatDt(row.created_at)}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-achira-blue/40 dark:text-achira-cream/35">
                    #{row.id.slice(0, 8)}
                    {row.payment_method && ` · ${row.payment_method}`}
                    {row.qpay_sender_invoice_no &&
                      ` · ${row.qpay_sender_invoice_no}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={row.status}
                    onChange={(e) => void changeStatus(row.id, e.target.value)}
                    className="rounded-lg border border-achira-blue/12 bg-white px-2 py-1 text-sm dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {labelStatus(ORDER_STATUS_LABELS, s)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => void handleDelete(row.id)}
                    className="rounded-lg border border-rose-200 p-2 text-rose-600 dark:border-rose-900/40 dark:text-rose-400"
                    aria-label="Устгах"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-achira-blue/65 dark:text-achira-cream/60">
                {row.shop_order_items?.map((item, i) => (
                  <li key={i}>
                    {item.product_name} × {item.quantity} —{" "}
                    {formatMnt(item.unit_price_mnt * item.quantity)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
