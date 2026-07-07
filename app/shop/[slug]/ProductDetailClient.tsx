"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailTabs } from "@/components/ProductDetailTabs";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/data/products";
import { fetchProductBySlug } from "@/lib/supabase/queries";
import { useProducts } from "@/hooks/useProducts";

export function ProductDetailClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { products } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const data = await fetchProductBySlug(slug);
      if (!cancelled) {
        setProduct(data);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-achira-blue/10" />
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-achira-blue/10" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-achira-blue/10" />
            <div className="h-32 animate-pulse rounded-2xl bg-achira-blue/10" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);
  const inStock = product.inStock !== false;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-36 sm:px-6 sm:pb-8 lg:py-12">
      <nav className="text-xs text-achira-blue/60 dark:text-achira-cream/55">
        <Link href="/" className="hover:text-achira-blue-dark dark:hover:text-achira-cream">
          Нүүр
        </Link>
        <span className="px-2 text-achira-blue/40 dark:text-achira-cream/40">/</span>
        <Link href="/shop" className="hover:text-achira-blue-dark dark:hover:text-achira-cream">
          Дэлгүүр
        </Link>
        <span className="px-2 text-achira-blue/40 dark:text-achira-cream/40">/</span>
        <span className="text-achira-blue-dark dark:text-achira-cream">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="rounded-2xl border border-achira-blue/10 bg-achira-paper/40 p-3 dark:border-achira-cream/10 dark:bg-achira-blue/8">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-achira-paper dark:bg-achira-navy/50">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 55vw"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-achira-navy/15 via-transparent to-transparent dark:from-black/25" />
            {!inStock && (
              <span className="absolute left-3 top-3 rounded-full bg-achira-navy/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-achira-cream backdrop-blur-sm dark:bg-black/70">
                Дууссан
              </span>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-normal tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm text-achira-blue/60 dark:text-achira-cream/55">
            Бүтээгдэхүүний код:{" "}
            <span className="font-mono text-achira-blue/75 dark:text-achira-cream/65">
              {product.slug}
            </span>
          </p>

          <ProductPurchasePanel
            slug={product.slug}
            name={product.name}
            priceMnt={product.priceMnt}
            imageUrl={product.imageUrl}
            inStock={inStock}
          />

          <ProductDetailTabs description={product.description} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14 pb-8">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-normal tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream">
              Төстэй бүтээгдэхүүнүүд
            </h2>
            <Link
              href="/shop"
              className="text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/55 hover:text-achira-blue-dark dark:text-achira-cream/50 dark:hover:text-achira-cream"
            >
              Бүгд
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
