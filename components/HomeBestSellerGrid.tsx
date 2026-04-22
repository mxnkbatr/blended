"use client";

import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/components/providers/LanguageProvider";

export function HomeBestSellerGrid() {
  const items = products.slice(0, 4);
  const { t } = useI18n();

  return (
    <section className="mt-5 w-full">
      <div className="px-0.5">
        <p className="text-[12px] font-bold tracking-wide text-zinc-950 dark:text-white">
          {t("bestSeller")}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-zinc-600">
          {t("bestSeller")}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}

