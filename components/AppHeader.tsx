"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Heart, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CartIconButton } from "./CartIconButton";
import { useMobileHomeScrolled } from "./providers/MobileHomeScrollProvider";
import { useNotifications } from "@/components/providers/NotificationsProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useI18n } from "@/components/providers/LanguageProvider";
import { hapticLight, hapticSelection } from "@/lib/haptics";

const layoutSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.55,
};

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
      className={`sticky top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow,backdrop-filter] duration-200 md:hidden ${
        raised
          ? "border-b border-white/[0.06] bg-achira-navy/88 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-3xl backdrop-saturate-150 dark:bg-achira-navy/88"
          : "bg-gradient-to-b from-achira-navy/70 via-achira-navy/25 to-transparent"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 transition-[height] duration-200 sm:px-5 ${
          compact ? "h-11" : "h-12"
        }`}
      >
        <Link
          href="/"
          onClick={() => void hapticSelection()}
          className="relative z-[1] flex shrink-0 items-center gap-2 text-achira-cream transition-opacity active:opacity-60"
          aria-label="Нүүр"
        >
          <div
            className={`relative overflow-hidden rounded-[0.65rem] ring-1 ring-white/10 transition-all duration-200 ${
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
            <motion.span
              layoutId="mobile-achira-title"
              className="font-[family-name:var(--font-display)] text-[12px] font-medium tracking-[0.18em] text-achira-cream"
              transition={layoutSpring}
            >
              ACHIRA
            </motion.span>
          ) : null}
        </Link>

        {isHome ? (
          <form
            className={`relative z-[1] flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.06] px-3.5 py-2 transition-all duration-200 ${
              compact
                ? "pointer-events-none max-w-0 px-0 opacity-0"
                : "max-w-[17rem] opacity-100"
            }`}
            role="search"
            aria-label="Хайх"
            onSubmit={(e) => {
              e.preventDefault();
              const next = q.trim();
              void hapticLight();
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

        <AnimatePresence mode="wait">
          {pageTitle ? (
            <motion.div
              key={pageTitle}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
              className="pointer-events-none absolute inset-x-0 flex flex-col items-center"
              aria-hidden
            >
              <span className="text-[17px] font-semibold tracking-[-0.01em] text-achira-cream">
                {pageTitle}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="relative z-[1] flex shrink-0 items-center gap-0.5">
          <Link
            href="/wishlist"
            onClick={() => void hapticLight()}
            className="relative grid h-10 w-10 place-items-center rounded-full text-achira-cream/70 transition-opacity active:opacity-50"
            aria-label="Хадгалсан"
          >
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.65} />
            {wishlistCount > 0 && (
              <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-achira-burgundy px-0.5 text-[8px] font-semibold text-white ring-2 ring-achira-navy">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/notifications"
            onClick={() => void hapticLight()}
            className="relative grid h-10 w-10 place-items-center rounded-full text-achira-cream/70 transition-opacity active:opacity-50"
            aria-label="Мэдэгдэл"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.65} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-achira-burgundy ring-2 ring-achira-navy" />
            )}
          </Link>
          <CartIconButton />
        </div>
      </div>
    </header>
  );
}
