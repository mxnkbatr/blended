"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

export function WishlistClient() {
  const { items, remove, clear } = useWishlist();
  const { addItem } = useCart();

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-600">
        Wishlist
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] text-white">
        Хадгалсан бараа
      </h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-zinc-500">
            Одоогоор хадгалсан бараа алга. Дэлгүүрээс зүрх дарж нэмээрэй.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-[11px] font-semibold tracking-wide text-black active:scale-[0.98]"
          >
            Дэлгүүр рүү
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Нийт: <span className="text-white">{items.length}</span>
            </p>
            <button
              type="button"
              onClick={clear}
              className="text-xs text-zinc-400 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              Бүгдийг цэвэрлэх
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {items.map((it) => (
              <div
                key={it.slug}
                className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md"
              >
                <Link
                  href={`/shop/${it.slug}`}
                  className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-zinc-900"
                >
                  <Image
                    src={it.imageUrl}
                    alt={it.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/shop/${it.slug}`}
                    className="block truncate text-[13px] font-semibold text-white"
                  >
                    {it.name}
                  </Link>
                  <p className="mt-1 text-[12px] font-bold text-white tabular-nums">
                    {formatMnt(it.priceMnt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        slug: it.slug,
                        name: it.name,
                        priceMnt: it.priceMnt,
                        imageUrl: it.imageUrl,
                        qty: 1,
                      })
                    }
                    className="grid h-9 w-9 place-items-center rounded-2xl bg-white text-black active:scale-[0.98]"
                    aria-label="Сагсанд нэмэх"
                  >
                    <ShoppingBag className="h-4 w-4" strokeWidth={1.35} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(it.slug)}
                    className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-300 transition-colors hover:bg-white/[0.06] active:scale-95"
                    aria-label="Хасах"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.35} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

