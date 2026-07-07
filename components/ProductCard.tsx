"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { hapticLight } from "@/lib/haptics";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const liked = has(product.slug);
  const inStock = product.inStock !== false;

  return (
    <article className="premium-card p-3 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(21,58,112,0.12)] dark:hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
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
            {!inStock && (
              <span className="absolute left-2 top-2 rounded-full bg-achira-navy/85 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-achira-cream backdrop-blur-sm dark:bg-black/75">
                Дууссан
              </span>
            )}
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
          disabled={!inStock}
          onClick={() => {
            if (!inStock) return;
            void hapticLight();
            addItem({
              slug: product.slug,
              name: product.name,
              priceMnt: product.priceMnt,
              imageUrl: product.imageUrl,
            });
          }}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-achira-blue px-3 text-[11px] font-semibold tracking-wide text-achira-cream transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-achira-cream dark:text-achira-blue-dark"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.35} />
          {inStock ? "Сагслах" : "Дууссан"}
        </button>
      </div>

      <Link href={`/shop/${product.slug}`} className="mt-3 block">
        <p className="line-clamp-1 text-[12px] font-bold text-achira-blue-dark dark:text-achira-cream">
          {product.name}
        </p>
        <p className="mt-2 text-[13px] font-semibold tracking-wide text-achira-blue tabular-nums dark:text-achira-cream">
          {formatMnt(product.priceMnt)}
        </p>
      </Link>
    </article>
  );
}
