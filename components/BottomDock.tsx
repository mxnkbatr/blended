"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Newspaper, ShoppingBag, User } from "lucide-react";
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
      {showBookingCta && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(3.65rem+env(safe-area-inset-bottom))] z-10 flex justify-center px-4 pb-2">
          <div className="pointer-events-auto flex w-full max-w-md gap-2">
            {count > 0 && (
              <Link
                href="/checkout"
                onClick={() => void hapticLight()}
                className="flex flex-1 items-center justify-center gap-2 rounded-[1.15rem] bg-achira-burgundy py-3 text-[11px] font-semibold tracking-wide text-white shadow-[0_10px_28px_rgba(122,30,49,0.35)] transition-transform active:scale-[0.97]"
              >
                <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2} />
                Сагс ({count})
              </Link>
            )}
            <Link
              href="/booking"
              onClick={() => void hapticMedium()}
              className={`flex items-center justify-center rounded-[1.15rem] bg-achira-cream py-3 text-[11px] font-semibold tracking-wide text-achira-blue-dark shadow-[0_10px_28px_rgba(0,0,0,0.35)] transition-transform active:scale-[0.97] ${
                count > 0 ? "flex-1" : "w-full"
              }`}
            >
              Цаг авах
            </Link>
          </div>
        </div>
      )}

      <nav
        className="relative border-t border-white/[0.1] bg-achira-navy pb-[env(safe-area-inset-bottom)]"
        aria-label="Доод цэс"
      >
        <div className="mx-auto flex h-[3.65rem] max-w-lg items-stretch justify-between px-1">
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
                className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 active:opacity-70 ${
                  active
                    ? "text-achira-cream"
                    : "text-achira-cream/38"
                }`}
              >
                {active ? (
                  <span
                    className="absolute inset-x-3 top-1.5 bottom-1.5 rounded-xl bg-white/[0.08]"
                    aria-hidden
                  />
                ) : null}
                <Icon
                  className="relative z-[1] h-[20px] w-[20px] shrink-0"
                  strokeWidth={active ? 2.15 : 1.6}
                  aria-hidden
                />
                <span
                  className={`relative z-[1] max-w-full truncate px-0.5 text-[9px] font-semibold tracking-[0.01em] ${
                    active ? "text-achira-cream" : "text-achira-cream/40"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
