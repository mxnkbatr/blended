"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export function CartIconButton() {
  const { count } = useCart();
  return (
    <Link
      href="/checkout"
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/[0.02] text-zinc-600 transition-colors hover:bg-black/[0.04] hover:text-zinc-900 active:scale-95 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:border-white/15 dark:hover:bg-white/[0.08] dark:hover:text-white"
      aria-label="Сагс"
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.35} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[9px] font-bold text-white dark:bg-white dark:text-black">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
