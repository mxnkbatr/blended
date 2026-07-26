"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, ShoppingBag, Store, User } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider";
import { hapticLight, hapticMedium, hapticSelection } from "@/lib/haptics";

const tabs = [
  { href: "/", label: "Нүүр", Icon: Home },
  { href: "/booking", label: "Барбер", Icon: CalendarDays },
  { href: "/shop", label: "Дэлгүүр", Icon: Store },
  { href: "/profile", label: "Профайл", Icon: User },
] as const;

export function BottomDock() {
  const pathname = usePathname();
  const { count } = useCart();
  const onBooking = pathname === "/booking" || pathname.startsWith("/booking/");
  const onProductDetail =
    pathname.startsWith("/shop/") && pathname !== "/shop/";
  const showBookingCta = !onBooking && !onProductDetail;
  const hidden =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    (pathname === "/checkout" && count === 0);

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-achira-cream via-achira-cream/70 to-transparent dark:from-achira-navy dark:via-achira-navy/65"
        aria-hidden
      />
      <div className="relative px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto w-full max-w-md space-y-2.5">
          {showBookingCta && (
            <div className="relative z-10 flex gap-2.5">
              {count > 0 && (
                <Link
                  href="/checkout"
                  onClick={() => void hapticLight()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-achira-burgundy/25 bg-achira-burgundy py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_36px_rgba(122,30,49,0.28),inset_0_1px_0_rgba(255,255,255,0.2)] transition-transform active:scale-[0.97]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Сагс ({count})
                </Link>
              )}
              <Link
                href="/booking"
                onClick={() => void hapticMedium()}
                className={`flex items-center justify-center rounded-full bg-achira-blue py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-achira-cream shadow-[0_14px_40px_rgba(28,74,140,0.32),inset_0_1px_0_rgba(255,255,255,0.22)] transition-transform active:scale-[0.97] dark:bg-achira-cream dark:text-achira-blue-dark dark:shadow-[0_14px_40px_rgba(0,0,0,0.35)] ${
                  count > 0 ? "flex-1" : "w-full"
                }`}
              >
                Цаг авах
              </Link>
            </div>
          )}

          <nav
            className="liquid-glass-strong relative z-10 flex items-center justify-between gap-1 rounded-full p-1.5"
            aria-label="Доод цэс"
          >
            {tabs.map(({ href, label, Icon }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    if (!active) void hapticSelection();
                  }}
                  className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-full py-2 transition-colors active:scale-95 ${
                    active
                      ? "text-achira-blue-dark dark:text-achira-cream"
                      : "text-achira-blue/45 hover:text-achira-blue/70 dark:text-achira-cream/45 dark:hover:text-achira-cream/70"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="bottom-dock-active"
                      className="absolute inset-0 rounded-full bg-gradient-to-b from-white/90 to-achira-champagne/50 shadow-[0_6px_18px_rgba(21,58,112,0.1),inset_0_1px_0_rgba(255,255,255,0.95)] dark:from-achira-cream/18 dark:to-achira-blue/25 dark:shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
                      transition={{
                        type: "spring",
                        stiffness: 480,
                        damping: 34,
                        mass: 0.65,
                      }}
                      aria-hidden
                    />
                  )}
                  <Icon
                    className="relative z-[1] h-[18px] w-[18px] shrink-0"
                    strokeWidth={active ? 2 : 1.35}
                    aria-hidden
                  />
                  <span
                    className={`relative z-[1] max-w-full truncate px-0.5 text-[8.5px] font-medium tracking-wide ${
                      active
                        ? "text-achira-blue-dark dark:text-achira-cream"
                        : "text-achira-blue/55 dark:text-achira-cream/50"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
