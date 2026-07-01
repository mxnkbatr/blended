"use client";

import Link from "next/link";
import { CalendarDays, Package, Scissors, ShoppingBag } from "lucide-react";

const cards = [
  {
    href: "/admin/barbers",
    title: "Баберууд",
    desc: "Нэмэх, засах, идэвхгүй болгох",
    Icon: Scissors,
  },
  {
    href: "/admin/products",
    title: "Бүтээгдэхүүн",
    desc: "Дэлгүүрийн бараа удирдах",
    Icon: Package,
  },
  {
    href: "/admin/appointments",
    title: "Цаг захиалга",
    desc: "Төлөв өөрчлөх, устгах",
    Icon: CalendarDays,
  },
  {
    href: "/admin/orders",
    title: "Захиалгууд",
    desc: "Төлбөр, хүргэлтийн төлөв",
    Icon: ShoppingBag,
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-xl text-achira-blue-dark dark:text-achira-cream md:text-2xl">
        Хянах самбар
      </h2>
      <p className="mt-2 text-sm text-achira-blue/60 dark:text-achira-cream/55">
        Бүх контентыг эндээс удирдана.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map(({ href, title, desc, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-achira-blue/12 bg-achira-paper/60 p-5 transition-all hover:border-achira-blue/25 hover:shadow-[0_12px_40px_rgba(30,79,150,0.1)] dark:border-achira-cream/10 dark:bg-achira-blue/10"
          >
            <Icon
              className="h-5 w-5 text-achira-blue group-hover:text-achira-blue-dark dark:text-achira-cream/70"
              strokeWidth={1.5}
            />
            <h3 className="mt-3 font-medium text-achira-blue-dark dark:text-achira-cream">
              {title}
            </h3>
            <p className="mt-1 text-sm text-achira-blue/55 dark:text-achira-cream/50">
              {desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
