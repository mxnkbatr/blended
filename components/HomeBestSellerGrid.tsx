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

      {items.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="premium-card mt-4 px-4 py-6 text-center">
          <p className="font-[family-name:var(--font-display)] text-base text-achira-blue-dark dark:text-achira-cream">
            Шинэ бараа удахгүй
          </p>
          <p className="mt-1.5 text-sm text-achira-blue/60 dark:text-achira-cream/55">
            Хугацаа, урамшууллын шинэ мэдээллээ мэдээ хэсгээс аваарай.
          </p>
        </div>
      )}
    </section>
  );
}

