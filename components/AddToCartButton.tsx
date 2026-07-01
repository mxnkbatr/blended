"use client";

import { useCart } from "@/components/providers/CartProvider";
import { hapticLight } from "@/lib/haptics";

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
      onClick={() => {
        void hapticLight();
        addItem({ slug, name, priceMnt, imageUrl, qty });
      }}
      className="w-full rounded-2xl bg-achira-blue py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-achira-cream shadow-[0_8px_32px_rgba(30,79,150,0.2)] transition-transform active:scale-[0.98] dark:bg-achira-cream dark:text-achira-blue-dark sm:w-auto sm:min-w-[220px] sm:px-10"
    >
      Сагсанд нэмэх
    </button>
  );
}
