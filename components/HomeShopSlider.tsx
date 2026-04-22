"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { products } from "@/lib/data/products";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n);
}

export function HomeShopSlider() {
  const { addItem } = useCart();

  return (
    <div className="mt-6 w-full text-left md:mt-10">
      <div className="mb-2.5 flex items-end justify-between gap-2 px-0.5">
        <div>
          <p className="text-[8px] font-medium uppercase tracking-[0.26em] text-zinc-600">
            Дэлгүүр
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-display)] text-[11px] tracking-wide text-zinc-400">
            Сонголтууд
          </p>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-px text-[8px] font-normal uppercase tracking-[0.2em] text-zinc-600 transition-colors hover:text-zinc-400"
        >
          Бүгд
          <ChevronRight className="h-2.5 w-2.5" strokeWidth={1.25} />
        </Link>
      </div>
      <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div
            key={p.slug}
            className="w-[6.85rem] shrink-0 snap-start sm:w-[7.25rem]"
          >
            <div className="relative">
              <Link
                href={`/shop/${p.slug}`}
                className="group/link relative block aspect-[4/5] origin-center overflow-hidden rounded-[1.125rem] border border-white/[0.08] bg-zinc-900/60 shadow-inner transition-[transform,border-color,box-shadow,filter] duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] hover:scale-[0.99] hover:border-white/12 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] active:scale-[0.96] active:duration-100 active:border-white/10"
              >
                <Image
                  src={p.imageUrl}
                  alt=""
                  fill
                  className="pointer-events-none object-cover transition-transform duration-500 ease-out group-hover/link:scale-[1.03]"
                  sizes="120px"
                />
                <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-[2] flex items-end p-2 pr-[2.35rem]">
                  <div className="pointer-events-none min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_24px_rgba(0,0,0,0.2)] ring-1 ring-white/[0.06] backdrop-blur-xl backdrop-saturate-150">
                    <p className="font-[family-name:var(--font-display)] text-[8.5px] font-normal leading-snug tracking-[0.02em] text-white/[0.92] line-clamp-2">
                      {p.name}
                    </p>
                    <p className="mt-0.5 font-[family-name:var(--font-display)] text-[8px] tabular-nums tracking-wide text-zinc-200/75">
                      {formatMnt(p.priceMnt)} ₮
                    </p>
                  </div>
                </div>
              </Link>
              <button
                type="button"
                className="absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_20px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.05] backdrop-blur-xl backdrop-saturate-150 transition-[transform,background-color,box-shadow,border-color] duration-200 hover:border-white/25 hover:bg-white/10 active:scale-[0.9] active:bg-white/[0.14]"
                aria-label="Сагсанд нэмэх"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem({
                    slug: p.slug,
                    name: p.name,
                    priceMnt: p.priceMnt,
                    imageUrl: p.imageUrl,
                  });
                }}
              >
                <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
