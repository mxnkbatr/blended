"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminFetchOrders,
  adminUpdateOrderStatus,
  type AdminOrderRow,
} from "@/lib/supabase/admin-crud";

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

  async function changeStatus(id: string, status: string) {
    try {
      await adminUpdateOrderStatus(id, status);
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
        {rows.length} захиалга
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
                </div>
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
