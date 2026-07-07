"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchUserOrders, type ShopOrder } from "@/lib/supabase/orders";
import { formatPhoneDisplay } from "@/lib/auth/phone";
import { hapticLight } from "@/lib/haptics";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ulaanbaatar",
  }).format(new Date(iso));
}

export function ProfileClient() {
  const router = useRouter();
  const { user, loading, signOut, isAdmin, profile } = useAuth();
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    let cancelled = false;
    setOrdersLoading(true);

    void fetchUserOrders(user.id).then((data) => {
      if (!cancelled) {
        setOrders(data);
        setOrdersLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="h-32 animate-pulse rounded-2xl bg-achira-blue/5 dark:bg-achira-cream/5" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-4 py-8 md:py-12">
        <div className="rounded-3xl border border-achira-blue/12 bg-achira-paper/60 p-6 text-center dark:border-achira-cream/10 dark:bg-achira-blue/10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-achira-blue/15 bg-white/70 dark:border-achira-cream/15 dark:bg-achira-navy/50">
            <User className="h-8 w-8 text-achira-blue/70 dark:text-achira-cream/70" strokeWidth={1.25} />
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-achira-blue-dark dark:text-achira-cream">
            Профайл
          </h1>
          <p className="mt-2 text-sm text-achira-blue/65 dark:text-achira-cream/60">
            Захиалгын түүх харах, хурдан нэвтрэхийн тулд бүртгэлээ үүсгэнэ үү.
          </p>
          <Link
            href="/login"
            onClick={() => void hapticLight()}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-achira-blue py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
          >
            Нэвтрэх
          </Link>
          <Link
            href="/register"
            onClick={() => void hapticLight()}
            className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-achira-blue/15 py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-achira-blue-dark dark:border-achira-cream/15 dark:text-achira-cream"
          >
            Бүртгүүлэх
          </Link>
        </div>

        <div className="mt-4 rounded-2xl border border-achira-blue/10 bg-achira-paper/40 p-2 dark:border-achira-cream/8 dark:bg-achira-blue/8">
          <Link
            href="/settings"
            className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-achira-blue/70 dark:text-achira-cream/70" />
              <span className="text-sm font-medium text-achira-blue-dark dark:text-achira-cream">
                Тохиргоо
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-achira-blue/40" />
          </Link>
        </div>
      </main>
    );
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Хэрэглэгч";

  const displayPhone =
    profile?.phone ??
    (user.user_metadata?.phone as string | undefined) ??
    null;

  return (
    <main className="mx-auto max-w-md px-4 py-8 md:py-12">
      <div className="rounded-3xl border border-achira-blue/12 bg-achira-paper/60 p-6 dark:border-achira-cream/10 dark:bg-achira-blue/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-achira-blue/15 bg-achira-blue text-lg font-semibold text-achira-cream dark:border-achira-cream/20 dark:bg-achira-cream dark:text-achira-blue-dark">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <button
            type="button"
            onClick={async () => {
              await hapticLight();
              await signOut();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-achira-blue/12 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-achira-blue/70 dark:border-achira-cream/12 dark:text-achira-cream/70"
          >
            <LogOut className="h-3.5 w-3.5" />
            Гарах
          </button>
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-achira-blue-dark dark:text-achira-cream">
          {displayName}
        </h1>
        {displayPhone && (
          <p className="mt-1 text-sm text-achira-blue/60 dark:text-achira-cream/55">
            {formatPhoneDisplay(displayPhone)}
          </p>
        )}
      </div>

      {isAdmin && (
        <Link
          href="/admin"
          onClick={() => void hapticLight()}
          className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-2xl border border-achira-burgundy/20 bg-gradient-to-r from-achira-burgundy/12 via-achira-blue/8 to-achira-blue/12 px-4 py-4 text-sm font-semibold text-achira-blue-dark shadow-[0_8px_28px_rgba(30,79,150,0.12)] transition-transform active:scale-[0.98] dark:border-achira-cream/15 dark:from-achira-cream/10 dark:via-achira-blue/20 dark:to-achira-navy/60 dark:text-achira-cream dark:shadow-[0_8px_28px_rgba(0,0,0,0.28)]"
        >
          <LayoutDashboard className="h-5 w-5 text-achira-burgundy dark:text-achira-cream" />
          Админ самбар руу орох
          <ChevronRight className="h-4 w-4 opacity-60" />
        </Link>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          href="/checkout"
          className="flex flex-col items-center gap-2 rounded-2xl border border-achira-blue/10 bg-white/60 px-3 py-4 active:scale-[0.98] dark:border-achira-cream/10 dark:bg-achira-navy/40"
        >
          <ShoppingBag className="h-5 w-5 text-achira-blue dark:text-achira-cream" />
          <span className="text-[11px] font-medium text-achira-blue-dark dark:text-achira-cream">
            Сагс
          </span>
        </Link>
        <Link
          href="/booking"
          className="flex flex-col items-center gap-2 rounded-2xl border border-achira-blue/10 bg-white/60 px-3 py-4 active:scale-[0.98] dark:border-achira-cream/10 dark:bg-achira-navy/40"
        >
          <CalendarDays className="h-5 w-5 text-achira-blue dark:text-achira-cream" />
          <span className="text-[11px] font-medium text-achira-blue-dark dark:text-achira-cream">
            Цаг авах
          </span>
        </Link>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-achira-blue/60 dark:text-achira-cream/55" />
          <h2 className="text-sm font-semibold text-achira-blue-dark dark:text-achira-cream">
            Захиалгын түүх
          </h2>
        </div>

        {ordersLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-achira-blue/5 dark:bg-achira-cream/5"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-achira-blue/15 px-4 py-8 text-center text-sm text-achira-blue/55 dark:border-achira-cream/12 dark:text-achira-cream/50">
            Одоогоор захиалга байхгүй.
            <Link href="/shop" className="mt-3 block text-achira-blue underline-offset-4 hover:underline dark:text-achira-cream">
              Дэлгүүр үзэх
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-achira-blue/10 bg-white/70 p-4 dark:border-achira-cream/10 dark:bg-achira-navy/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-achira-blue-dark dark:text-achira-cream">
                      {formatMnt(order.total_mnt)}
                    </p>
                    <p className="mt-1 text-[11px] text-achira-blue/55 dark:text-achira-cream/50">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <span className="rounded-full bg-achira-blue/8 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-achira-blue dark:bg-achira-cream/10 dark:text-achira-cream">
                    {order.status === "AWAITING_PAYMENT" ? "Төлбөр хүлээж" : order.status}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-achira-blue/65 dark:text-achira-cream/60">
                  {order.shop_order_items?.map((item, idx) => (
                    <li key={`${order.id}-${idx}`}>
                      {item.product_name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-4 rounded-2xl border border-achira-blue/10 bg-achira-paper/40 p-2 dark:border-achira-cream/8 dark:bg-achira-blue/8">
        <Link
          href="/settings"
          className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-achira-blue/70 dark:text-achira-cream/70" />
            <span className="text-sm font-medium text-achira-blue-dark dark:text-achira-cream">
              Тохиргоо
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-achira-blue/40" />
        </Link>
      </div>
    </main>
  );
}
