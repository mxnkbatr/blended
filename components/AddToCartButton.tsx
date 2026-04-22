"use client";

import { useCart } from "@/components/providers/CartProvider";

type Props = {
  slug: string;
  name: string;
  priceMnt: number;
  imageUrl: string;
  qty?: number;
};

export function AddToCartButton({
  slug,
  name,
  priceMnt,
  imageUrl,
  qty,
}: Props) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem({ slug, name, priceMnt, imageUrl, qty })}
      className="w-full rounded-2xl border border-white/25 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 py-3.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_36px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.65)] transition-[transform,box-shadow,filter] duration-300 ease-out hover:shadow-[0_0_0_1px_rgba(255,255,255,0.28),0_10px_44px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.75)] active:scale-[0.98] active:duration-150 sm:w-auto sm:min-w-[220px] sm:px-10"
    >
      Сагсанд нэмэх
    </button>
  );
}
