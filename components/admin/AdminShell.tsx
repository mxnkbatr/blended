"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Package,
  Scissors,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";

const navGroups = [
  {
    title: "Эхлэл",
    items: [
      { href: "/admin", label: "Тойм", hint: "Өнөөдрийн тойм", Icon: LayoutDashboard, exact: true },
    ],
  },
  {
    title: "Үйлчилгээ",
    items: [
      { href: "/admin/appointments", label: "Цаг захиалга", hint: "Төлбөр · төлөв", Icon: CalendarDays },
      { href: "/admin/barbers", label: "Барберууд", hint: "Зураг · хуваарь", Icon: Scissors },
    ],
  },
  {
    title: "Дэлгүүр",
    items: [
      { href: "/admin/orders", label: "Захиалга", hint: "QPay · хүргэлт", Icon: ShoppingBag },
      { href: "/admin/products", label: "Бараа", hint: "Үнэ · нөөц", Icon: Package },
      { href: "/admin/promos", label: "Промо код", hint: "Хөнгөлөлт", Icon: Tag },
    ],
  },
  {
    title: "Контент & систем",
    items: [
      { href: "/admin/news", label: "Мэдээ", hint: "Апп мэдээлэл", Icon: Newspaper },
      { href: "/admin/notifications", label: "Мэдэгдэл", hint: "Push · inbox", Icon: Megaphone },
      { href: "/admin/users", label: "Хэрэглэгч", hint: "Admin эрх", Icon: Users },
    ],
  },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-achira-cream)_88%,white),var(--color-achira-cream))] dark:bg-[linear-gradient(180deg,var(--color-achira-navy),color-mix(in_srgb,var(--color-achira-navy)_92%,black))]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 md:flex-row md:gap-8 md:py-8">
        <aside className="shrink-0 md:w-60">
          <Link
            href="/"
            className="mb-3 inline-flex text-sm text-achira-blue/55 hover:text-achira-blue-dark dark:text-achira-cream/50 dark:hover:text-achira-cream md:hidden"
          >
            ← Апп руу буцах
          </Link>

          <div className="admin-panel !p-4 md:!p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/40 dark:text-achira-cream/35">
              Achira Admin
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-xl text-achira-blue-dark dark:text-achira-cream">
              Удирдлага
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-achira-blue/50 dark:text-achira-cream/45">
              Цаг, захиалга, бараа, мэдээг нэг дороос удирдана.
            </p>

            {/* Mobile: horizontal chips */}
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden" aria-label="Админ цэс">
              {navGroups.flatMap((g) => g.items).map(({ href, label, Icon, ...rest }) => {
                const exact = "exact" in rest && rest.exact;
                const active = exact
                  ? pathname === href
                  : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm transition-colors ${
                      active
                        ? "bg-achira-blue text-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                        : "border border-achira-gold/20 bg-white/60 text-achira-blue/70 dark:border-achira-cream/10 dark:bg-achira-navy/40 dark:text-achira-cream/70"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop: grouped sidebar */}
            <nav className="mt-5 hidden space-y-5 md:block" aria-label="Админ цэс">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-achira-blue/40 dark:text-achira-cream/35">
                    {group.title}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map(({ href, label, hint, Icon, ...rest }) => {
                      const exact = "exact" in rest && rest.exact;
                      const active = exact
                        ? pathname === href
                        : pathname === href || pathname.startsWith(`${href}/`);
                      return (
                        <li key={href}>
                          <Link
                            href={href}
                            className={`flex items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors ${
                              active
                                ? "bg-gradient-to-r from-achira-blue to-achira-blue-dark text-achira-cream shadow-[0_8px_22px_rgba(28,74,140,0.22)] dark:from-achira-cream dark:to-achira-champagne dark:text-achira-blue-dark"
                                : "text-achira-blue/75 hover:bg-achira-blue/6 dark:text-achira-cream/70 dark:hover:bg-achira-cream/8"
                            }`}
                          >
                            <Icon
                              className="mt-0.5 h-4 w-4 shrink-0"
                              strokeWidth={1.75}
                            />
                            <span className="min-w-0">
                              <span className="block text-sm font-medium leading-tight">
                                {label}
                              </span>
                              <span
                                className={`mt-0.5 block text-[11px] leading-tight ${
                                  active
                                    ? "opacity-75"
                                    : "text-achira-blue/45 dark:text-achira-cream/40"
                                }`}
                              >
                                {hint}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            <Link
              href="/"
              className="mt-5 hidden text-sm text-achira-blue/50 hover:text-achira-blue-dark dark:text-achira-cream/45 dark:hover:text-achira-cream md:inline-block"
            >
              ← Апп руу буцах
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="admin-panel min-h-[60dvh]">{children}</div>
        </div>
      </div>
    </div>
  );
}
