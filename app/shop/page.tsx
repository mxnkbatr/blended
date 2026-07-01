import { Suspense } from "react";
import { ShopPageClient } from "./ShopPageClient";

export const metadata = {
  title: "Дэлгүүр",
  description: "Үсний вакс, арчилгааны бүтээгдэхүүн",
};

function ShopFallback() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-achira-blue/55">
        Shop
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-achira-blue-dark sm:text-5xl">
        Дэлгүүр
      </h1>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopPageClient />
    </Suspense>
  );
}
