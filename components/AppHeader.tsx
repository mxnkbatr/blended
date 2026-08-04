"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Heart, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CartIconButton } from "./CartIconButton";
import { useMobileHomeScrolled } from "./providers/MobileHomeScrollProvider";
import { useNotifications } from "@/components/providers/NotificationsProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useI18n } from "@/components/providers/LanguageProvider";

const pageTitles: { prefix: string; title: string }[] = [
  { prefix: "/news", title: "Мэдээ мэдээлэл" },
  { prefix: "/booking", title: "Цаг авах" },
  { prefix: "/shop", title: "Дэлгүүр" },
  { prefix: "/profile", title: "Профайл" },
  { prefix: "/wishlist", title: "Хадгалсан" },
  { prefix: "/notifications", title: "Мэдэгдэл" },
  { prefix: "/checkout", title: "Сагс" },
  { prefix: "/settings", title: "Тохиргоо" },
];

function titleFor(pathname: string): string | null {
  const match = pageTitles.find(
    (p) => pathname === p.prefix || pathname.startsWith(`${p.prefix}/`),
  );
  return match ? match.title : null;
}

/** Зөвхөн гар утас — desktop дээр `SiteHeader` ашиглана */
export function AppHeader() {
  const pathname = usePathname();
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    return null;
  }
  const scrolled = useMobileHomeScrolled();
  const isHome = pathname === "/";
  const compact = isHome && scrolled;
  const raised = compact || !isHome;
  const router = useRouter();
  const { t } = useI18n();
  const { count: wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();
  const pageTitle = isHome ? null : titleFor(pathname);
  const [q, setQ] = useState("");

  return (
    <header
      className={`sticky top-0 z-50 pt-[env(safe-area-inset-top)] md:hidden ${
        raised
          ? "border-b border-white/[0.08] bg-achira-navy"
          : "bg-achira-navy/80"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-6xl items-center justify-between gap-2.5 px-4 sm:px-6 ${
          compact ? "h-11" : "h-12"
        }`}
      >
        <Link
          href="/"
          className="relative z-[1] flex shrink-0 items-center gap-2.5 text-achira-cream active:opacity-60"
          aria-label="Нүүр"
        >
          <div
            className={`relative overflow-hidden rounded-[0.65rem] ring-1 ring-white/10 ${
              compact ? "h-7 w-7" : "h-8 w-8"
            }`}
          >
            <Image
              src="/achira-logo.png"
              alt="Achira Artist"
              fill
              className="object-contain"
              sizes="44px"
              priority
            />
          </div>
          {isHome && compact ? (
            <span className="font-[family-name:var(--font-display)] text-[11px] font-medium tracking-[0.2em] text-achira-cream/90">
              ACHIRA
            </span>
          ) : null}
        </Link>

        {/* Search — зөвхөн нүүр хуудсанд */}
        {isHome ? (
          <form
            className={`relative z-[1] flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.06] px-3.5 py-2 ${
              compact
                ? "pointer-events-none max-w-0 px-0 opacity-0"
                : "max-w-[17rem] opacity-100"
            }`}
            role="search"
            aria-label="Хайх"
            onSubmit={(e) => {
              e.preventDefault();
              const next = q.trim();
              router.push(
                next.length ? `/shop?q=${encodeURIComponent(next)}` : "/shop",
              );
            }}
          >
            <Search
              className="h-3.5 w-3.5 shrink-0 text-achira-cream/40"
              strokeWidth={1.75}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-[15px] leading-none text-achira-cream outline-none placeholder:text-achira-cream/35"
              inputMode="search"
              enterKeyHint="search"
              aria-label="Хайх"
            />
          </form>
        ) : null}

        {pageTitle ? (
          <div
            className="pointer-events-none absolute inset-x-0 flex flex-col items-center"
            aria-hidden
          >
            <span className="font-[family-name:var(--font-display)] text-[13px] tracking-[0.06em] text-achira-cream">
              {pageTitle}
            </span>
          </div>
        ) : null}

        <div className="relative z-[1] flex shrink-0 items-center gap-0.5">
          <Link
            href="/wishlist"
            className="relative grid h-9 w-9 place-items-center rounded-full text-achira-cream/60 active:opacity-60"
            aria-label="Хадгалсан"
          >
            <Heart className="h-[17px] w-[17px]" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-achira-burgundy px-0.5 text-[8px] font-semibold text-white ring-2 ring-achira-cream dark:ring-achira-navy">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full text-achira-cream/60 active:opacity-60"
            aria-label="Мэдэгдэл"
          >
            <Bell className="h-[17px] w-[17px]" strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-achira-burgundy ring-2 ring-achira-cream dark:ring-achira-navy" />
            )}
          </Link>
          <CartIconButton />
        </div>
      </div>

    </header>
  );
}
