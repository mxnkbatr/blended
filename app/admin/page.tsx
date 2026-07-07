"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  adminFetchDashboardStats,
  type DashboardStats,
} from "@/lib/supabase/admin-crud";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

const cards = [
  {
    href: "/admin/barbers",
    title: "Баберууд",
    desc: "Зураг, цагийн хуваарь",
    statKey: "barbers" as const,
  },
  {
    href: "/admin/products",
    title: "Бүтээгдэхүүн",
    desc: "Дэлгүүрийн бараа",
    statKey: "products" as const,
  },
  {
    href: "/admin/appointments",
    title: "Цаг захиалга",
    desc: "Хүлээгдэж буй захиалга",
    statKey: "pendingAppointments" as const,
    statLabel: "хүлээгдэж буй",
  },
  {
    href: "/admin/orders",
    title: "Захиалгууд",
    desc: "Төлбөрийн төлөв",
    statKey: "awaitingPaymentOrders" as const,
    statLabel: "төлбөр хүлээгдэж",
  },
  {
    href: "/admin/promos",
    title: "Промо код",
    desc: "Хөнгөлөлтийн код удирдах",
  },
  {
    href: "/admin/notifications",
    title: "Мэдэгдэл",
    desc: "Хэрэглэгчид мэдэгдэл илгээх",
  },
  {
    href: "/admin/users",
    title: "Хэрэглэгчид",
    desc: "Admin эрх",
  },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setStats(await adminFetchDashboardStats());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <AdminPageHeader
        title="Тойм"
        description="Өнөөдрийн үзүүлэлт болон хурдан холбоосууд."
      />

      <AdminFeedback error={error} className="mt-4" />

      {stats && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="admin-stat">
            <p className="admin-stat-label">Өнөөдрийн орлого</p>
            <p className="admin-stat-value text-lg sm:text-2xl">
              {formatMnt(stats.todayRevenueMnt)}
            </p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat-label">Хүлээгдэж буй цаг</p>
            <p className="admin-stat-value">{stats.pendingAppointments}</p>
          </div>
          <div className="admin-stat col-span-2 sm:col-span-1">
            <p className="admin-stat-label">Төлбөр хүлээгдэж буй</p>
            <p className="admin-stat-value">{stats.awaitingPaymentOrders}</p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {cards.map((card) => {
          const stat =
            stats && "statKey" in card ? stats[card.statKey] : undefined;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-achira-blue/8 bg-achira-paper/35 px-4 py-4 transition-colors hover:border-achira-blue/18 hover:bg-white/70 dark:border-achira-cream/8 dark:bg-achira-blue/8 dark:hover:bg-achira-navy/40"
            >
              <h3 className="font-medium text-achira-blue-dark dark:text-achira-cream">
                {card.title}
              </h3>
              <p className="mt-1 text-sm text-achira-blue/55 dark:text-achira-cream/50">
                {card.desc}
              </p>
              {stat !== undefined && (
                <p className="mt-3 text-sm font-medium text-achira-burgundy dark:text-achira-gold">
                  {stat}{" "}
                  {"statLabel" in card ? card.statLabel : "бүртгэлтэй"}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
