"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  Package,
  Scissors,
  ShoppingBag,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Хянах самбар", Icon: LayoutDashboard, exact: true },
  { href: "/admin/barbers", label: "Баберууд", Icon: Scissors },
  { href: "/admin/products", label: "Бүтээгдэхүүн", Icon: Package },
  { href: "/admin/appointments", label: "Цаг захиалга", Icon: CalendarDays },
  { href: "/admin/orders", label: "Захиалгууд", Icon: ShoppingBag },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:py-10 lg:gap-10">
      <aside className="shrink-0 md:w-56">
        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-achira-blue/55 dark:text-achira-cream/50">
          Admin
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-achira-blue-dark dark:text-achira-cream">
          Удирдлага
        </h1>
        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
          {links.map(({ href, label, Icon, ...rest }) => {
            const exact = "exact" in rest && rest.exact;
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors md:w-full ${
                  active
                    ? "border-achira-blue/20 bg-achira-blue text-achira-cream dark:border-achira-cream/20 dark:bg-achira-cream dark:text-achira-blue-dark"
                    : "border-achira-blue/10 bg-white/50 text-achira-blue-dark hover:border-achira-blue/20 dark:border-achira-cream/10 dark:bg-achira-navy/40 dark:text-achira-cream"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="mt-6 hidden text-xs text-achira-blue/55 underline-offset-4 hover:underline dark:text-achira-cream/50 md:inline-block"
        >
          ← Вэб рүү буцах
        </Link>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
