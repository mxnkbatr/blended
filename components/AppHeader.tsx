"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Heart, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { CartIconButton } from "./CartIconButton";
import { useMobileHomeScrolled } from "./providers/MobileHomeScrollProvider";
import { useNotifications } from "@/components/providers/NotificationsProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useI18n } from "@/components/providers/LanguageProvider";
import { useState } from "react";

const layoutSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.55,
};

/** Зөвхөн гар утас — desktop дээр `SiteHeader` ашиглана */
export function AppHeader() {
  const pathname = usePathname();
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/")
  ) {
    return null;
  }
  const scrolled = useMobileHomeScrolled();
  const isHome = pathname === "/";
  const compact = isHome && scrolled;
  const router = useRouter();
  const { count: wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();
  const { t } = useI18n();

  const [q, setQ] = useState("");

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[height,background-color,backdrop-filter,box-shadow,border-color] duration-300 md:hidden ${
        compact
          ? "border-achira-blue/10 bg-achira-cream/85 shadow-[0_12px_40px_rgba(30,79,150,0.10)] backdrop-blur-md dark:border-achira-cream/8 dark:bg-achira-navy/80 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          : "border-achira-blue/10 bg-achira-cream/70 backdrop-blur-sm dark:border-achira-cream/6 dark:bg-achira-navy/60"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 transition-[height] duration-300 sm:px-6 ${
          compact ? "h-9" : "h-10"
        }`}
      >
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5 text-achira-blue transition-opacity hover:opacity-90 dark:text-achira-cream"
          >
            <div
              className={`relative overflow-hidden rounded-md transition-all duration-300 ${
                compact ? "h-6 w-6" : "h-7 w-7"
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
            {isHome ? (
              compact ? (
                <motion.span
                  layoutId="mobile-achira-title"
                  className="font-[family-name:var(--font-display)] text-[9px] font-medium tracking-[0.28em] text-achira-blue/90 dark:text-achira-cream/90"
                  transition={layoutSpring}
                >
                  ACHIRA
                </motion.span>
              ) : null
            ) : (
              <span className="font-[family-name:var(--font-display)] text-[8px] font-medium tracking-[0.24em] text-achira-blue/90 dark:text-achira-cream/90">
                ACHIRA
              </span>
            )}
          </Link>
        </div>

        {/* Mobile search bar (UI) */}
        <form
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1.5 text-zinc-600 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 ${
            compact
              ? "max-w-0 opacity-0 pointer-events-none"
              : "max-w-[16.5rem] opacity-100"
          }`}
          role="search"
          aria-label="Хайх"
          onSubmit={(e) => {
            e.preventDefault();
            const next = q.trim();
            router.push(next.length ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
          }}
        >
          <Search className="h-4 w-4 shrink-0" strokeWidth={1.25} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent text-base text-zinc-900 placeholder:text-zinc-500 outline-none dark:text-zinc-200"
            inputMode="search"
            enterKeyHint="search"
            aria-label="Хайх"
          />
        </form>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/wishlist"
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-black/[0.02] text-zinc-600 transition-colors hover:bg-black/[0.04] hover:text-zinc-900 active:scale-95 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:border-white/15 dark:hover:bg-white/[0.08] dark:hover:text-white"
            aria-label="Wishlist"
          >
            <div className="relative">
              <Heart className="h-4 w-4" strokeWidth={1.25} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[9px] font-bold text-white dark:bg-white dark:text-black">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </div>
          </Link>
          <Link
            href="/notifications"
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-black/[0.02] text-zinc-600 transition-colors hover:bg-black/[0.04] hover:text-zinc-900 active:scale-95 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:border-white/15 dark:hover:bg-white/[0.08] dark:hover:text-white"
            aria-label="Notifications"
          >
            <div className="relative">
              <Bell className="h-4 w-4" strokeWidth={1.25} />
              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-950 shadow-[0_0_0_3px_rgba(255,255,255,0.85)] dark:bg-white dark:shadow-[0_0_0_3px_rgba(0,0,0,0.7)]" />
              )}
            </div>
          </Link>
          <CartIconButton />
        </div>
      </div>
    </header>
  );
}
