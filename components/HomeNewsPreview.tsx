"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";
import {
  fetchPublishedNews,
  formatNewsDate,
  type NewsPost,
} from "@/lib/supabase/news";

export function HomeNewsPreview() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchPublishedNews(3).then((data) => {
      if (!cancelled) {
        setPosts(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="mt-8 w-full">
        <div className="h-28 animate-pulse rounded-3xl bg-achira-paper/70 dark:bg-achira-blue/10" />
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="mt-8 w-full" aria-label="Мэдээ">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="premium-section-kicker">News</p>
          <h2 className="premium-section-title mt-1 text-base tracking-[0.04em]">
            Мэдээ мэдээлэл
          </h2>
        </div>
        <Link href="/news" className="cream-pill">
          Бүгд
        </Link>
      </div>

      <ul className="space-y-2.5">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/news/${post.slug}`}
              className="premium-card flex items-start gap-3 px-4 py-3.5 transition-[transform,background-color] active:scale-[0.99] hover:from-white/90"
            >
              <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-achira-gold/20 bg-white/70 text-achira-blue shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-achira-cream/10 dark:bg-achira-cream/10 dark:text-achira-cream">
                <Newspaper className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-achira-blue-dark dark:text-achira-cream">
                  {post.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-achira-blue/55 dark:text-achira-cream/50">
                  {post.excerpt || formatNewsDate(post.publishedAt)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
