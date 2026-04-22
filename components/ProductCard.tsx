"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const liked = has(product.slug);
  return (
    <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-3 shadow-[0_16px_50px_rgba(0,0,0,0.10)] backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
        <Link href={`/shop/${product.slug}`} className="block">
          <div className="relative aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width:640px) 50vw, 25vw"
            />
          </div>
        </Link>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            toggle({
              slug: product.slug,
              name: product.name,
              priceMnt: product.priceMnt,
              imageUrl: product.imageUrl,
            })
          }
          className={`grid h-10 w-10 place-items-center rounded-2xl border bg-black/[0.02] transition-colors active:scale-95 dark:bg-white/[0.03] ${
            liked
              ? "border-black/20 text-zinc-950 dark:border-white/20 dark:text-white"
              : "border-black/10 text-zinc-600 hover:bg-black/[0.04] dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
          }`}
          aria-label={liked ? "Wishlist-с хасах" : "Wishlist-д нэмэх"}
        >
          <Heart
            className={`h-4 w-4 ${liked ? "fill-zinc-950 dark:fill-white" : ""}`}
            strokeWidth={1.35}
          />
        </button>
        <button
          type="button"
          onClick={() =>
            addItem({
              slug: product.slug,
              name: product.name,
              priceMnt: product.priceMnt,
              imageUrl: product.imageUrl,
            })
          }
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-3 text-[11px] font-semibold tracking-wide text-black transition-transform active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.35} />
          Сагслах
        </button>
      </div>

      <Link href={`/shop/${product.slug}`} className="mt-3 block">
        <p className="line-clamp-1 text-[12px] font-bold text-zinc-950 dark:text-white">
          {product.name}
        </p>
        <p className="mt-2 text-[13px] font-bold text-zinc-950 tabular-nums dark:text-white">
          {formatMnt(product.priceMnt)}
        </p>
      </Link>
    </article>
  );
}
