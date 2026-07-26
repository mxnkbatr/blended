"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export function CartIconButton() {
  const { count } = useCart();
  return (
    <Link
      href="/checkout"
      className="relative grid h-9 w-9 place-items-center rounded-full text-achira-blue/60 transition-all hover:bg-white/60 hover:text-achira-blue-dark active:scale-90 dark:text-achira-cream/60 dark:hover:bg-white/8 dark:hover:text-achira-cream"
      aria-label="Сагс"
    >
      <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-achira-burgundy px-0.5 text-[8px] font-semibold text-white ring-2 ring-achira-cream dark:ring-achira-navy">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
