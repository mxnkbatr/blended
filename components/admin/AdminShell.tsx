"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  Megaphone,
  Package,
  Scissors,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Тойм", Icon: LayoutDashboard, exact: true },
  { href: "/admin/barbers", label: "Бабер", Icon: Scissors },
  { href: "/admin/products", label: "Бараа", Icon: Package },
  { href: "/admin/promos", label: "Промо", Icon: Tag },
  { href: "/admin/notifications", label: "Мэдэгдэл", Icon: Megaphone },
  { href: "/admin/appointments", label: "Цаг", Icon: CalendarDays },
  { href: "/admin/orders", label: "Захиалга", Icon: ShoppingBag },
  { href: "/admin/users", label: "Хэрэглэгч", Icon: Users },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-achira-cream)_88%,white),var(--color-achira-cream))] dark:bg-[linear-gradient(180deg,var(--color-achira-navy),color-mix(in_srgb,var(--color-achira-navy)_92%,black))]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 md:flex-row md:gap-8 md:py-8">
        <aside className="shrink-0 md:w-52">
          <Link
            href="/"
            className="mb-3 inline-flex text-sm text-achira-blue/55 hover:text-achira-blue-dark dark:text-achira-cream/50 dark:hover:text-achira-cream md:hidden"
          >
            ← Буцах
          </Link>

          <div className="admin-panel !p-4 md:!p-5">
            <p className="text-xs font-medium text-achira-blue/45 dark:text-achira-cream/40">
              ACHIRA Admin
            </p>
            <h1 className="mt-1 text-lg font-semibold text-achira-blue-dark dark:text-achira-cream">
              Удирдлага
            </h1>

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
              {links.map(({ href, label, Icon, ...rest }) => {
                const exact = "exact" in rest && rest.exact;
                const active = exact
                  ? pathname === href
                  : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors md:w-full ${
                      active
                        ? "bg-achira-blue text-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                        : "text-achira-blue/70 hover:bg-achira-blue/6 dark:text-achira-cream/70 dark:hover:bg-achira-cream/8"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/"
              className="mt-4 hidden text-sm text-achira-blue/50 hover:text-achira-blue-dark dark:text-achira-cream/45 dark:hover:text-achira-cream md:inline-block"
            >
              Вэб рүү буцах
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
