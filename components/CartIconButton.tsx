"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export function CartIconButton() {
  const { count } = useCart();
  return (
    <Link
      href="/checkout"
      className="ios-icon-btn relative"
      aria-label="Сагс"
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-achira-burgundy px-1 text-[9px] font-bold text-white shadow-[0_0_0_2px_var(--color-achira-cream)]">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
