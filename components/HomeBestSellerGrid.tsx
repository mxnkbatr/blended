"use client";

import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/components/providers/LanguageProvider";
import { useProducts } from "@/hooks/useProducts";

export function HomeBestSellerGrid() {
  const { products } = useProducts();
  const items = products.slice(0, 4);
  const { t } = useI18n();

  return (
    <section className="mt-6 w-full">
      <div className="px-0.5">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-achira-gold/35 to-transparent" />
          <p className="premium-section-kicker">{t("bestSeller")}</p>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-achira-gold/35 to-transparent" />
        </div>
        <p className="premium-section-title mt-2 text-center">{t("bestSeller")}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}

