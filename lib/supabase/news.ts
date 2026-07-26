import { createSupabaseBrowserClient } from "./client";

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl: string | null;
  publishedAt: string;
};

function mapPost(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  published_at: string;
}): NewsPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    coverImageUrl: row.cover_image_url,
    publishedAt: row.published_at,
  };
}

export async function fetchPublishedNews(limit = 40): Promise<NewsPost[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("news_posts")
    .select(
      "id, slug, title, excerpt, body, cover_image_url, published_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("[supabase] fetchPublishedNews:", error.message);
    return [];
  }

  return (data ?? []).map(mapPost);
}

export async function fetchNewsBySlug(slug: string): Promise<NewsPost | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("news_posts")
    .select(
      "id, slug, title, excerpt, body, cover_image_url, published_at",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.warn("[supabase] fetchNewsBySlug:", error.message);
    return null;
  }

  return data ? mapPost(data) : null;
}

export function formatNewsDate(iso: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    dateStyle: "medium",
    timeZone: "Asia/Ulaanbaatar",
  }).format(new Date(iso));
}

export function slugifyNewsTitle(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0400-\u04ff-]+/gi, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);

  return base || `medee-${Date.now().toString(36)}`;
}
