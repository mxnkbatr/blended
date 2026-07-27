"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Megaphone,
  Newspaper,
  Package,
  Scissors,
  ShoppingBag,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  adminFetchDashboardStats,
  type DashboardStats,
} from "@/lib/supabase/admin-crud";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminAutoRefresh } from "@/hooks/useAdminAutoRefresh";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

type DashCard = {
  href: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  statKey?: keyof DashboardStats;
  statLabel?: string;
  urgent?: boolean;
};

const urgentCards: DashCard[] = [
  {
    href: "/admin/appointments",
    title: "Цаг захиалга",
    desc: "Шинэ эсвэл хүлээгдэж буй цагуудыг шалгана",
    Icon: CalendarDays,
    statKey: "pendingAppointments",
    statLabel: "шинэ / хүлээгдэж буй",
    urgent: true,
  },
  {
    href: "/admin/orders",
    title: "Дэлгүүрийн захиалга",
    desc: "Төлбөр хүлээж буй захиалгыг шалгана",
    Icon: ShoppingBag,
    statKey: "awaitingPaymentOrders",
    statLabel: "төлбөр хүлээгдэж",
    urgent: true,
  },
];

const serviceCards: DashCard[] = [
  {
    href: "/admin/barbers",
    title: "Барберууд",
    desc: "Зураг, үнэ, цагийн хуваарь",
    Icon: Scissors,
    statKey: "barbers",
    statLabel: "бүртгэлтэй",
  },
];

const shopCards: DashCard[] = [
  {
    href: "/admin/products",
    title: "Бараа",
    desc: "Дэлгүүрийн бүтээгдэхүүн, нөөц",
    Icon: Package,
    statKey: "products",
    statLabel: "бараа",
  },
  {
    href: "/admin/promos",
    title: "Промо код",
    desc: "Хөнгөлөлтийн код удирдах",
    Icon: Tag,
  },
];

const contentCards: DashCard[] = [
  {
    href: "/admin/news",
    title: "Мэдээ",
    desc: "Апп доторх мэдээ мэдээлэл",
    Icon: Newspaper,
  },
  {
    href: "/admin/notifications",
    title: "Мэдэгдэл",
    desc: "Хэрэглэгчид мэдэгдэл илгээх",
    Icon: Megaphone,
  },
  {
    href: "/admin/users",
    title: "Хэрэглэгчид",
    desc: "Admin эрх өгөх / хасах",
    Icon: Users,
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-achira-blue/45 dark:text-achira-cream/40">
      {children}
    </h3>
  );
}

function DashLinkCard({
  card,
  stats,
}: {
  card: DashCard;
  stats: DashboardStats | null;
}) {
  const stat =
    stats && card.statKey !== undefined ? stats[card.statKey] : undefined;
  const highlight =
    card.urgent && typeof stat === "number" && stat > 0;

  return (
    <Link
      href={card.href}
      className={`group flex items-start gap-3 rounded-2xl border px-4 py-4 transition-all ${
        highlight
          ? "border-amber-500/30 bg-amber-500/8 shadow-[0_10px_28px_rgba(180,120,40,0.08)] dark:border-amber-400/25 dark:bg-amber-400/10"
          : "border-achira-gold/15 bg-white/55 hover:border-achira-gold/30 hover:bg-white/80 dark:border-achira-cream/8 dark:bg-achira-navy/35 dark:hover:bg-achira-navy/50"
      }`}
    >
      <div
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          highlight
            ? "bg-amber-500/15 text-amber-800 dark:text-amber-300"
            : "bg-achira-blue/8 text-achira-blue dark:bg-achira-cream/10 dark:text-achira-cream"
        }`}
      >
        <card.Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-achira-blue-dark dark:text-achira-cream">
            {card.title}
          </p>
          <ArrowRight className="h-4 w-4 shrink-0 text-achira-blue/30 transition-transform group-hover:translate-x-0.5 dark:text-achira-cream/30" />
        </div>
        <p className="mt-0.5 text-sm leading-snug text-achira-blue/55 dark:text-achira-cream/50">
          {card.desc}
        </p>
        {stat !== undefined && (
          <p
            className={`mt-2.5 text-sm font-semibold ${
              highlight
                ? "text-amber-800 dark:text-amber-300"
                : "text-achira-blue dark:text-achira-gold"
            }`}
          >
            {stat} {card.statLabel ?? ""}
          </p>
        )}
      </div>
    </Link>
  );
}

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

  useAdminAutoRefresh(load);

  return (
    <div>
      <AdminPageHeader
        title="Тойм"
        description="Эхлээд яаралтай зүйлсээ шалгаад, дараа нь бусад хэсгүүд рүү орно."
      />

      <AdminFeedback error={error} className="mt-4" />

      {stats && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="admin-stat">
            <p className="admin-stat-label">Өнөөдрийн орлого</p>
            <p className="admin-stat-value text-lg sm:text-2xl">
              {formatMnt(stats.todayRevenueMnt)}
            </p>
            <p className="mt-1 text-[11px] text-achira-blue/45 dark:text-achira-cream/40">
              Төлөгдсөн дэлгүүрийн захиалга
            </p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat-label">Шинэ цаг</p>
            <p className="admin-stat-value">{stats.pendingAppointments}</p>
            <p className="mt-1 text-[11px] text-achira-blue/45 dark:text-achira-cream/40">
              Шалгах шаардлагатай байж болно
            </p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat-label">Төлбөр хүлээж буй</p>
            <p className="admin-stat-value">{stats.awaitingPaymentOrders}</p>
            <p className="mt-1 text-[11px] text-achira-blue/45 dark:text-achira-cream/40">
              Дэлгүүрийн захиалга
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-7">
        <section>
          <SectionTitle>1. Эхлээд шалга</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {urgentCards.map((card) => (
              <DashLinkCard key={card.href} card={card} stats={stats} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>2. Үйлчилгээ</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {serviceCards.map((card) => (
              <DashLinkCard key={card.href} card={card} stats={stats} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>3. Дэлгүүр</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {shopCards.map((card) => (
              <DashLinkCard key={card.href} card={card} stats={stats} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>4. Контент & систем</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {contentCards.map((card) => (
              <DashLinkCard key={card.href} card={card} stats={stats} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
