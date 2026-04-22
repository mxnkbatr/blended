"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";

export function CartNavLink() {
  const { count } = useCart();
  return (
    <Link
      href="/checkout"
      className="relative rounded-full px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white sm:px-4"
    >
      Сагс
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
