"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminFetchProfiles,
  adminUpdateProfileRole,
  type ProfileRow,
} from "@/lib/supabase/admin-crud";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { hapticSuccess } from "@/lib/haptics";

function formatDt(iso: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    dateStyle: "medium",
    timeZone: "Asia/Ulaanbaatar",
  }).format(new Date(iso));
}

export default function AdminUsersPage() {
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await adminFetchProfiles());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeRole(id: string, role: "customer" | "admin") {
    setError(null);
    setSuccess(null);
    try {
      await adminUpdateProfileRole(id, role);
      setSuccess("Эрх амжилттай шинэчлэгдлээ.");
      await hapticSuccess();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа");
    }
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-xl text-achira-blue-dark dark:text-achira-cream">
        Хэрэглэгчид
      </h2>
      <p className="mt-1 text-sm text-achira-blue/55 dark:text-achira-cream/50">
        Admin эрх олгох, хасах
      </p>

      <AdminFeedback success={success} error={error} />

      {loading ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-achira-blue/5" />
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-achira-blue/55 dark:text-achira-cream/50">
          Хэрэглэгч байхгүй.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-achira-blue/10 bg-white/60 px-4 py-3 dark:border-achira-cream/10 dark:bg-achira-navy/40"
            >
              <div className="min-w-0">
                <p className="font-medium text-achira-blue-dark dark:text-achira-cream">
                  {row.full_name || "Нэргүй"}
                </p>
                <p className="text-sm text-achira-blue/60 dark:text-achira-cream/55">
                  {row.phone || "—"} · {formatDt(row.created_at)}
                </p>
                <p className="mt-1 font-mono text-[10px] text-achira-blue/40 dark:text-achira-cream/35">
                  {row.id.slice(0, 8)}…
                </p>
              </div>
              <select
                value={row.role}
                onChange={(e) =>
                  void changeRole(row.id, e.target.value as "customer" | "admin")
                }
                className="rounded-lg border border-achira-blue/12 bg-white px-2 py-1.5 text-sm dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
              >
                <option value="customer">Хэрэглэгч</option>
                <option value="admin">Admin</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
