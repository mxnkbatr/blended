"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";

export function CartNavLink() {
  const { count } = useCart();
  return (
    <Link
      href="/checkout"
      className="relative px-3 py-2 text-[13px] tracking-wide text-achira-blue/55 transition-colors hover:text-achira-blue-dark dark:text-achira-cream/50 dark:hover:text-achira-cream"
    >
      Сагс
      {count > 0 && (
        <span className="absolute -right-0.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-achira-burgundy/90 px-1 text-[9px] font-semibold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
