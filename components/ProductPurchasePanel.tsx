"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { QuantityPicker } from "@/components/QuantityPicker";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

export function ProductPurchasePanel({
  slug,
  name,
  priceMnt,
  imageUrl,
}: {
  slug: string;
  name: string;
  priceMnt: number;
  imageUrl: string;
}) {
  const [qty, setQty] = useState(1);
  const total = useMemo(() => priceMnt * qty, [priceMnt, qty]);

  return (
    <>
      <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/20 p-5 backdrop-blur-md">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-600">
              Үнэ
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-normal tracking-wide text-white">
              {formatMnt(priceMnt)}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Нийт: <span className="text-zinc-400">{formatMnt(total)}</span>
            </p>
          </div>
          <QuantityPicker value={qty} onChange={setQty} />
        </div>

        <div className="mt-5 hidden sm:block">
          <AddToCartButton
            slug={slug}
            name={name}
            priceMnt={priceMnt}
            imageUrl={imageUrl}
            qty={qty}
          />
        </div>
      </div>

      {/* Mobile sticky add-to-cart (shop.mn-like) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 sm:hidden">
        <div
          className="h-28 bg-gradient-to-t from-black via-black/85 to-transparent"
          aria-hidden
        />
        <div className="pointer-events-auto px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-zinc-950/35 p-2 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <QuantityPicker value={qty} onChange={setQty} />
              <div className="flex-1">
                <AddToCartButton
                  slug={slug}
                  name={name}
                  priceMnt={priceMnt}
                  imageUrl={imageUrl}
                  qty={qty}
                />
              </div>
            </div>
            <p className="mt-2 px-1 text-[10px] uppercase tracking-[0.22em] text-zinc-600">
              Нийт: <span className="text-zinc-300">{formatMnt(total)}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

