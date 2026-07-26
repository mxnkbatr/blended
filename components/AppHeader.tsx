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
      className={`ios-navigation-bar ${compact
        ? "bg-achira-cream/90 dark:bg-achira-navy/90 shadow-[0_4px_16px_rgba(21,58,112,0.03)]"
        : ""
        }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 transition-[height] duration-300 sm:px-6 ${compact ? "h-10" : "h-12"
          }`}
      >
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5 text-achira-blue transition-opacity hover:opacity-90 dark:text-achira-cream"
          >
            <div
              className={`relative overflow-hidden rounded-lg transition-all duration-300 ${compact ? "h-6 w-6" : "h-7.5 w-7.5"
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
                  className="font-[family-name:var(--font-display)] text-[9.5px] font-semibold tracking-[0.24em] text-achira-blue-dark dark:text-achira-cream/90"
                  transition={layoutSpring}
                >
                  ACHIRA
                </motion.span>
              ) : null
            ) : (
              <span className="font-[family-name:var(--font-display)] text-[8.5px] font-semibold tracking-[0.2em] text-achira-blue-dark dark:text-achira-cream/90">
                ACHIRA
              </span>
            )}
          </Link>
        </div>

        {/* Mobile search bar (UI) */}
        <form
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] px-3 py-1.5 text-zinc-550 transition-all duration-300 ${compact
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
          <Search className="h-4 w-4 shrink-0 text-zinc-400" strokeWidth={2.0} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none dark:text-zinc-200"
            inputMode="search"
            enterKeyHint="search"
            aria-label="Хайх"
          />
        </form>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/wishlist"
            className="grid h-9 w-9 place-items-center text-zinc-500 transition-all duration-150 active:scale-90 active:opacity-70 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
            aria-label="Wishlist"
          >
            <div className="relative">
              <Heart className="h-[21px] w-[21px]" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF3B30] px-1 text-[9px] font-bold text-white shadow-[0_0_0_2px_rgba(244,239,230,0.9)] dark:shadow-[0_0_0_2px_rgba(15,26,46,0.9)]">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </div>
          </Link>
          <Link
            href="/notifications"
            className="grid h-9 w-9 place-items-center text-zinc-500 transition-all duration-150 active:scale-90 active:opacity-70 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
            aria-label="Notifications"
          >
            <div className="relative">
              <Bell className="h-[21px] w-[21px]" strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 top-0 h-2.5 w-2.5 rounded-full bg-[#FF3B30] border-2 border-achira-cream dark:border-achira-navy" />
              )}
            </div>
          </Link>
          <CartIconButton />
        </div>
      </div>
    </header>
  );
}
