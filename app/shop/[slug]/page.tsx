import { products } from "@/lib/data/products";
import { ProductDetailClient } from "./ProductDetailClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ProductDetailClient params={params} />;
}
