"use client";

import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/components/providers/LanguageProvider";
import { useProducts } from "@/hooks/useProducts";

export function HomeBestSellerGrid() {
  const { products } = useProducts();
  const items = products.slice(0, 4);
  const { t } = useI18n();

  return (
    <section className="mt-5 w-full">
      <div className="px-0.5">
        <p className="text-[12px] font-bold tracking-wide text-achira-blue-dark dark:text-achira-cream">
          {t("bestSeller")}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-achira-blue/55 dark:text-achira-cream/50">
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

