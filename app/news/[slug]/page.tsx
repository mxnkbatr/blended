import { fetchPublishedNewsSlugs } from "@/lib/supabase/news";
import { NewsDetailClient } from "./NewsDetailClient";

/**
 * Next.js output:"export" treats an empty prerenderedRoutes list as
 * "missing generateStaticParams()" ? so we always return at least one path.
 */
export async function generateStaticParams() {
  let slugs: string[] = [];
  try {
    slugs = await fetchPublishedNewsSlugs();
  } catch (error) {
    console.warn("[news] generateStaticParams failed:", error);
  }

  if (slugs.length === 0) {
    return [{ slug: "_" }];
  }

  return slugs.map((slug) => ({ slug }));
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <NewsDetailClient params={params} />;
}
