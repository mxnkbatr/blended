"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useProducts } from "@/hooks/useProducts";
import { hapticLight } from "@/lib/haptics";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n);
}

export function HomeShopSlider() {
  const { addItem } = useCart();
  const { products } = useProducts();
  const items = products.slice(0, 8);

  if (items.length === 0) return null;

  return (
    <div className="mt-6 w-full text-left">
      <div className="mb-3 flex items-end justify-between gap-2 px-0.5">
        <div>
          <p className="text-[13px] font-semibold tracking-[-0.01em] text-achira-cream">
            Сонголтууд
          </p>
          <p className="mt-0.5 text-[12px] text-achira-cream/45">Дэлгүүр</p>
        </div>
        <Link
          href="/shop"
          className="text-[13px] font-medium text-achira-blue-light active:opacity-60"
        >
          Бүгд
        </Link>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((p) => {
          const inStock = p.inStock !== false;
          return (
            <div
              key={p.slug}
              className="w-[7rem] shrink-0 snap-start sm:w-[7.5rem]"
            >
              <div className="relative">
                <Link
                  href={`/shop/${p.slug}`}
                  className="group/link relative block aspect-[4/5] overflow-hidden rounded-[1.15rem] bg-achira-blue/20 ring-1 ring-white/[0.08] transition-transform active:scale-[0.97]"
                >
                  <Image
                    src={p.imageUrl}
                    alt=""
                    fill
                    className="pointer-events-none object-cover"
                    sizes="120px"
                  />
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  {!inStock && (
                    <span className="absolute left-1.5 top-1.5 z-[2] rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      Дууссан
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 z-[2] p-2 pr-10">
                    <p className="line-clamp-2 text-[12px] font-semibold leading-snug tracking-[-0.01em] text-white">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-[11px] tabular-nums text-white/70">
                      {formatMnt(p.priceMnt)} ₮
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  disabled={!inStock}
                  className="absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/15 backdrop-blur-md transition-transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Сагсанд нэмэх"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!inStock) return;
                    void hapticLight();
                    addItem({
                      slug: p.slug,
                      name: p.name,
                      priceMnt: p.priceMnt,
                      imageUrl: p.imageUrl,
                    });
                  }}
                >
                  <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
