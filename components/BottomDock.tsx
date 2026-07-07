"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, ShoppingBag, Store, User } from "lucide-react";
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-achira-cream via-achira-cream/55 to-transparent dark:from-achira-navy dark:via-achira-navy/55"
        aria-hidden
      />
      <div className="relative px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto w-full max-w-md space-y-2">
          {showBookingCta && (
            <div className="relative z-10 flex gap-2">
              {count > 0 && (
                <Link
                  href="/checkout"
                  onClick={() => void hapticLight()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-achira-burgundy/20 bg-achira-burgundy/90 py-3.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_8px_32px_rgba(124,31,50,0.2)] active:scale-[0.97]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Сагс ({count})
                </Link>
              )}
              <Link
                href="/booking"
                onClick={() => void hapticMedium()}
                className={`flex items-center justify-center rounded-2xl border border-achira-blue/15 bg-achira-blue py-3.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-achira-cream shadow-[0_8px_32px_rgba(30,79,150,0.25)] transition-[transform,background-color] active:scale-[0.97] dark:border-achira-cream/20 dark:bg-achira-cream dark:text-achira-blue-dark ${
                  count > 0 ? "flex-1" : "w-full"
                }`}
              >
                Цаг авах
              </Link>
            </div>
          )}
          <nav
            className="relative z-10 flex items-center justify-between gap-1 rounded-2xl border border-achira-gold/15 bg-achira-cream/88 px-1 py-1.5 shadow-[0_-10px_36px_rgba(21,58,112,0.10),0_1px_0_rgba(255,255,255,0.65)_inset] backdrop-blur-xl dark:border-achira-gold/10 dark:bg-achira-navy/78 dark:shadow-[0_-10px_40px_rgba(0,0,0,0.32)]"
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
                  className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition-colors active:scale-95 ${
                    active
                      ? "text-achira-blue dark:text-achira-cream"
                      : "text-achira-blue/50 hover:text-achira-blue/75 dark:text-achira-cream/50 dark:hover:text-achira-cream/75"
                  }`}
                >
                  <Icon
                    className="h-[17px] w-[17px] shrink-0"
                    strokeWidth={active ? 1.35 : 1.05}
                    aria-hidden
                  />
                  <span
                    className={`max-w-full truncate px-0.5 text-[8.5px] font-medium tracking-wide ${
                      active
                        ? "text-achira-blue-dark dark:text-achira-cream"
                        : "text-achira-blue/60 dark:text-achira-cream/55"
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
