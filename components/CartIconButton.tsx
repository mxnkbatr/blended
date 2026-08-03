"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { hapticLight } from "@/lib/haptics";

export function CartIconButton() {
  const { count } = useCart();
  return (
    <Link
      href="/checkout"
      onClick={() => void hapticLight()}
      className="relative grid h-10 w-10 place-items-center rounded-full text-achira-cream/70 transition-opacity active:opacity-50"
      aria-label="Сагс"
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.65} />
      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-achira-burgundy px-0.5 text-[8px] font-semibold text-white ring-2 ring-achira-navy">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
