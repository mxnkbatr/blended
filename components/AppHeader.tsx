"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Heart, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
    pathname.startsWith("/register/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
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
      className={`ios-navigation-bar md:hidden ${
        compact
          ? "border-achira-gold/15 bg-achira-cream/75 shadow-[0_8px_28px_rgba(21,58,112,0.06)]"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-2.5 px-4 transition-[height] duration-300 sm:px-6 ${
          compact ? "h-11" : "h-[3.25rem]"
        }`}
      >
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-achira-blue transition-opacity hover:opacity-90 dark:text-achira-cream"
          >
            <div
              className={`relative overflow-hidden rounded-[0.85rem] shadow-[0_4px_14px_rgba(21,58,112,0.1)] transition-all duration-300 ${
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
            {isHome ? (
              compact ? (
                <motion.span
                  layoutId="mobile-achira-title"
                  className="font-[family-name:var(--font-display)] text-[10px] font-semibold tracking-[0.22em] text-achira-blue-dark dark:text-achira-cream/90"
                  transition={layoutSpring}
                >
                  ACHIRA
                </motion.span>
              ) : null
            ) : (
              <span className="font-[family-name:var(--font-display)] text-[9px] font-semibold tracking-[0.2em] text-achira-blue-dark dark:text-achira-cream/90">
                ACHIRA
              </span>
            )}
          </Link>
        </div>

        <form
          className={`liquid-glass flex min-w-0 flex-1 items-center gap-2 rounded-full px-3.5 py-2 transition-all duration-300 ${
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

        <div className="flex shrink-0 items-center gap-1.5">
          <Link href="/wishlist" className="ios-icon-btn" aria-label="Wishlist">
            <div className="relative">
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-achira-burgundy px-1 text-[9px] font-bold text-white shadow-[0_0_0_2px_var(--color-achira-cream)]">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </div>
          </Link>
          <Link
            href="/notifications"
            className="ios-icon-btn"
            aria-label="Notifications"
          >
            <div className="relative">
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 top-0 h-2.5 w-2.5 rounded-full border-2 border-achira-cream bg-achira-burgundy dark:border-achira-navy" />
              )}
            </div>
          </Link>
          <CartIconButton />
        </div>
      </div>
    </header>
  );
}
