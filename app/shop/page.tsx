import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data/products";

export const metadata = {
  title: "Дэлгүүр",
  description: "Үсний вакс, арчилгааны бүтээгдэхүүн",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();
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
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Shop</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-white sm:text-5xl">
        Дэлгүүр
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-zinc-400">
        Вакс болон үс арчилгааны сонголтууд.
      </p>
      {q.length > 0 && (
        <p className="mt-4 text-sm text-zinc-500">
          <span className="text-zinc-400">“{q}”</span> хайлтын үр дүн:{" "}
          <span className="text-white">{filtered.length}</span>
        </p>
      )}
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-500">
          Тохирох бүтээгдэхүүн олдсонгүй.
        </div>
      )}
    </main>
  );
}
