import { fetchPublishedNewsSlugs } from "@/lib/supabase/news";
import { NewsDetailClient } from "./NewsDetailClient";

export async function generateStaticParams() {
  const slugs = await fetchPublishedNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <NewsDetailClient params={params} />;
}
