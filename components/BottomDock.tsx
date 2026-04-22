"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Store, User } from "lucide-react";

const tabs = [
  { href: "/", label: "Нүүр", Icon: Home },
  { href: "/booking", label: "Барбер", Icon: CalendarDays },
  { href: "/shop", label: "Бүтээгдэхүүн", Icon: Store },
  { href: "/profile", label: "Профайл", Icon: User },
] as const;

export function BottomDock() {
  const pathname = usePathname();
  const onBooking = pathname === "/booking" || pathname.startsWith("/booking/");

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/55 to-transparent dark:from-black dark:via-black/55"
        aria-hidden
      />
      <div className="relative px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto w-full max-w-md space-y-2">
          {!onBooking && (
            <Link
              href="/booking"
              className="relative z-10 flex w-full items-center justify-center rounded-2xl border border-black/10 bg-zinc-950 py-3.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_10px_44px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.10)] transition-[transform,background-color,box-shadow,color,filter] duration-300 ease-out active:scale-[0.97] dark:border-white/25 dark:bg-gradient-to-b dark:from-zinc-50 dark:via-white dark:to-zinc-100 dark:text-zinc-950 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_36px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.65)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.28),0_10px_44px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.75)] dark:active:from-zinc-200 dark:active:via-zinc-100 dark:active:to-zinc-200 dark:active:text-zinc-800 dark:active:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_4px_24px_rgba(255,255,255,0.08),inset_0_2px_8px_rgba(0,0,0,0.06)] dark:active:duration-150"
            >
              Цаг авах
            </Link>
          )}
          <nav
            className="relative z-10 flex items-center justify-between gap-1 rounded-2xl border border-black/10 bg-white/70 px-1 py-1.5 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-white/[0.07] dark:bg-zinc-950/35 dark:shadow-[0_-8px_32px_rgba(0,0,0,0.25)]"
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
                  className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition-colors active:scale-95 ${
                    active
                      ? "text-zinc-950 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-400"
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
                        ? "text-zinc-700 dark:text-zinc-200"
                        : "text-zinc-600 dark:text-zinc-600"
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
