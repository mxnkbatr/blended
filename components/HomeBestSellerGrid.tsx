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
      <div className="flex items-end justify-between gap-2 px-0.5">
        <p className="text-[13px] font-semibold tracking-[-0.01em] text-achira-cream">
          {t("bestSeller")}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[1.25rem] bg-white/[0.05] px-4 py-6 text-center ring-1 ring-white/[0.08]">
          <p className="text-[15px] font-semibold text-achira-cream">
            Шинэ бараа удахгүй
          </p>
          <p className="mt-1.5 text-[13px] text-achira-cream/50">
            Хугацаа, урамшууллын шинэ мэдээллээ мэдээ хэсгээс аваарай.
          </p>
        </div>
      )}
    </section>
  );
}

