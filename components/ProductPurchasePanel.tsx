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
  inStock = true,
}: {
  slug: string;
  name: string;
  priceMnt: number;
  imageUrl: string;
  inStock?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const total = useMemo(() => priceMnt * qty, [priceMnt, qty]);

  return (
    <>
      <div className="mt-6 rounded-2xl border border-achira-blue/12 bg-achira-paper/60 p-5 dark:border-achira-cream/10 dark:bg-achira-blue/10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-achira-blue/55 dark:text-achira-cream/50">
              Үнэ
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-normal tracking-wide text-achira-blue-dark dark:text-achira-cream">
              {formatMnt(priceMnt)}
            </p>
            <p className="mt-1 text-xs text-achira-blue/60 dark:text-achira-cream/55">
              Нийт:{" "}
              <span className="font-medium text-achira-blue-dark dark:text-achira-cream">
                {formatMnt(total)}
              </span>
            </p>
            {!inStock && (
              <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">
                Одоогоор нөөцгүй. Дэлгүүрт түр харагдана.
              </p>
            )}
          </div>
          <QuantityPicker value={qty} onChange={setQty} disabled={!inStock} />
        </div>

        <div className="mt-5 hidden sm:block">
          <AddToCartButton
            slug={slug}
            name={name}
            priceMnt={priceMnt}
            imageUrl={imageUrl}
            qty={qty}
            disabled={!inStock}
          />
        </div>
      </div>

      {/* Mobile sticky add-to-cart */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 sm:hidden">
        <div
          className="h-32 bg-gradient-to-t from-achira-cream via-achira-cream/90 to-transparent dark:from-achira-navy dark:via-achira-navy/90"
          aria-hidden
        />
        <div className="pointer-events-auto px-4 pb-[max(5.5rem,calc(0.75rem+env(safe-area-inset-bottom)+4.5rem))]">
          <div className="mx-auto max-w-md rounded-2xl border border-achira-blue/12 bg-achira-paper/95 p-2 shadow-[0_-8px_32px_rgba(30,79,150,0.12)] backdrop-blur-md dark:border-achira-cream/10 dark:bg-achira-navy/90 dark:shadow-[0_-8px_32px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2">
              <QuantityPicker value={qty} onChange={setQty} disabled={!inStock} />
              <div className="flex-1">
                <AddToCartButton
                  slug={slug}
                  name={name}
                  priceMnt={priceMnt}
                  imageUrl={imageUrl}
                  qty={qty}
                  disabled={!inStock}
                />
              </div>
            </div>
            <p className="mt-2 px-1 text-[10px] uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50">
              Нийт:{" "}
              <span className="font-medium text-achira-blue-dark dark:text-achira-cream">
                {formatMnt(total)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
