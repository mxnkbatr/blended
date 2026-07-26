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
      className={`sticky top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-300 md:hidden ${
        raised
          ? "bg-gradient-to-b from-[#fbf8f2]/95 via-achira-cream/88 to-achira-cream/75 shadow-[0_12px_32px_rgba(21,58,112,0.05)] backdrop-blur-2xl dark:from-achira-navy/95 dark:via-achira-navy/88 dark:to-achira-navy/75 dark:shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
          : "bg-gradient-to-b from-achira-cream/45 via-achira-cream/15 to-transparent dark:from-achira-navy/45 dark:via-achira-navy/10"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-6xl items-center justify-between gap-2.5 px-4 transition-[height] duration-300 sm:px-6 ${
          compact ? "h-11" : "h-[3.1rem]"
        }`}
      >
        <Link
          href="/"
          className="relative z-[1] flex shrink-0 items-center gap-2.5 text-achira-blue transition-opacity active:opacity-70 dark:text-achira-cream"
          aria-label="Нүүр"
        >
          <div
            className={`relative overflow-hidden rounded-[0.7rem] shadow-[0_3px_10px_rgba(21,58,112,0.08)] ring-1 ring-achira-gold/15 transition-all duration-300 dark:ring-white/10 ${
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
              className="font-[family-name:var(--font-display)] text-[11px] font-medium tracking-[0.2em] text-achira-blue-dark dark:text-achira-cream/90"
              transition={layoutSpring}
            >
              ACHIRA
            </motion.span>
          ) : null}
        </Link>

        {/* Search — зөвхөн нүүр хуудсанд */}
        {isHome ? (
          <form
            className={`relative z-[1] flex min-w-0 flex-1 items-center gap-2 rounded-full border border-achira-gold/18 bg-gradient-to-b from-white/80 to-achira-champagne/35 px-3.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_6px_18px_rgba(21,58,112,0.05)] backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:from-white/10 dark:to-achira-blue/15 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_18px_rgba(0,0,0,0.25)] ${
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
              className="h-3.5 w-3.5 shrink-0 text-achira-blue/40 dark:text-achira-cream/40"
              strokeWidth={1.75}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-sm text-achira-ink outline-none placeholder:text-achira-blue/35 dark:text-achira-cream dark:placeholder:text-achira-cream/35"
              inputMode="search"
              enterKeyHint="search"
              aria-label="Хайх"
            />
          </form>
        ) : null}

        {/* Хуудасны гарчиг — нүүрээс бусад хуудсанд */}
        <AnimatePresence mode="wait">
          {pageTitle ? (
            <motion.div
              key={pageTitle}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="pointer-events-none absolute inset-x-0 flex flex-col items-center"
              aria-hidden
            >
              <span className="font-[family-name:var(--font-display)] text-[13px] tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream">
                {pageTitle}
              </span>
              <span className="mt-0.5 h-px w-6 bg-gradient-to-r from-transparent via-achira-gold/60 to-transparent" />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="relative z-[1] flex shrink-0 items-center gap-0.5">
          <Link
            href="/wishlist"
            className="relative grid h-9 w-9 place-items-center rounded-full text-achira-blue/60 transition-all hover:bg-white/60 hover:text-achira-blue-dark active:scale-90 dark:text-achira-cream/60 dark:hover:bg-white/8 dark:hover:text-achira-cream"
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
            className="relative grid h-9 w-9 place-items-center rounded-full text-achira-blue/60 transition-all hover:bg-white/60 hover:text-achira-blue-dark active:scale-90 dark:text-achira-cream/60 dark:hover:bg-white/8 dark:hover:text-achira-cream"
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

      <div
        className={`h-px bg-gradient-to-r from-transparent via-achira-gold/45 to-transparent transition-opacity duration-300 dark:via-achira-gold/25 ${
          raised ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
    </header>
  );
}
