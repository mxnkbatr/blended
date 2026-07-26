"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Newspaper, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider";
import { hapticLight, hapticMedium, hapticSelection } from "@/lib/haptics";

const tabs = [
  { href: "/", label: "Нүүр", Icon: Home },
  { href: "/booking", label: "Барбер", Icon: CalendarDays },
  { href: "/news", label: "Мэдээ", Icon: Newspaper },
  { href: "/profile", label: "Профайл", Icon: User },
] as const;

export function BottomDock() {
  const pathname = usePathname();
  const { count } = useCart();
  const onBooking = pathname === "/booking" || pathname.startsWith("/booking/");
  const onProductDetail =
    pathname.startsWith("/shop/") && pathname !== "/shop";
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-achira-cream via-achira-cream/75 to-transparent dark:from-achira-navy dark:via-achira-navy/70"
        aria-hidden
      />
      <div className="relative px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto w-full max-w-md space-y-2">
          {showBookingCta && (
            <div className="relative z-10 flex gap-2">
              {count > 0 && (
                <Link
                  href="/checkout"
                  onClick={() => void hapticLight()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-achira-burgundy/20 bg-gradient-to-b from-achira-burgundy to-[#6a1a2b] py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white shadow-[0_10px_28px_rgba(122,30,49,0.22)] transition-transform active:scale-[0.98]"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Сагс ({count})
                </Link>
              )}
              <Link
                href="/booking"
                onClick={() => void hapticMedium()}
                className={`flex items-center justify-center rounded-2xl bg-gradient-to-b from-achira-blue-light to-achira-blue py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-achira-cream shadow-[0_10px_28px_rgba(28,74,140,0.24)] transition-transform active:scale-[0.98] dark:from-achira-cream dark:to-achira-champagne dark:text-achira-blue-dark dark:shadow-[0_10px_28px_rgba(0,0,0,0.3)] ${
                  count > 0 ? "flex-1" : "w-full"
                }`}
              >
                Цаг авах
              </Link>
            </div>
          )}

          <nav
            className="relative z-10 flex items-center justify-between gap-0.5 rounded-2xl border border-achira-gold/18 bg-gradient-to-b from-white/85 via-achira-cream/75 to-achira-champagne/40 p-1 shadow-[0_12px_40px_rgba(21,58,112,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl dark:border-white/8 dark:from-achira-navy/80 dark:via-achira-navy/70 dark:to-achira-blue/20 dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
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
                  className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-colors active:scale-95 ${
                    active
                      ? "text-achira-blue-dark dark:text-achira-cream"
                      : "text-achira-blue/40 hover:text-achira-blue/65 dark:text-achira-cream/40 dark:hover:text-achira-cream/65"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="bottom-dock-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-b from-white to-achira-champagne/45 shadow-[0_4px_14px_rgba(21,58,112,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] dark:from-achira-cream/14 dark:to-achira-blue/20 dark:shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
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
                    className="relative z-[1] h-[17px] w-[17px] shrink-0"
                    strokeWidth={active ? 1.85 : 1.35}
                    aria-hidden
                  />
                  <span
                    className={`relative z-[1] max-w-full truncate px-0.5 text-[8.5px] font-medium tracking-wide ${
                      active
                        ? "text-achira-blue-dark dark:text-achira-cream"
                        : "text-achira-blue/50 dark:text-achira-cream/45"
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
