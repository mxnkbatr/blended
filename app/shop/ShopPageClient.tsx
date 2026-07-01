"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export function ShopPageClient() {
  const searchParams = useSearchParams();
  const { products } = useProducts();
  const q = (searchParams.get("q") ?? "").trim();
  const qLower = q.toLowerCase();
  const filtered =
    q.length === 0
      ? products
      : products.filter((p) => {
          const haystack = `${p.name} ${p.description}`.toLowerCase();
          return haystack.includes(qLower);
        });

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-achira-blue/55 dark:text-achira-cream/50">
        Shop
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-achira-blue-dark dark:text-achira-cream sm:text-5xl">
        Дэлгүүр
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-achira-blue/65 dark:text-achira-cream/60">
        Вакс болон үс арчилгааны сонголтууд.
      </p>
      {q.length > 0 && (
        <p className="mt-4 text-sm text-achira-blue/60 dark:text-achira-cream/55">
          <span className="text-achira-blue/70 dark:text-achira-cream/70">
            &ldquo;{q}&rdquo;
          </span>{" "}
          хайлтын үр дүн:{" "}
          <span className="text-achira-blue-dark dark:text-achira-cream">
            {filtered.length}
          </span>
        </p>
      )}
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-12 rounded-3xl border border-achira-blue/10 bg-achira-paper/50 p-6 text-sm text-achira-blue/60 dark:border-achira-cream/10 dark:bg-achira-blue/8 dark:text-achira-cream/55">
          Тохирох бүтээгдэхүүн олдсонгүй.
        </div>
      )}
    </main>
  );
}
