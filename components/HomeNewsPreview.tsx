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
        <Link
          href="/news"
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-achira-blue/55 transition-colors hover:text-achira-burgundy dark:text-achira-cream/50 dark:hover:text-achira-cream"
        >
          Бүгд
        </Link>
      </div>

      <ul className="space-y-2.5">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/news/${post.slug}`}
              className="premium-card flex items-start gap-3 px-4 py-3.5 transition-[transform,background-color] active:scale-[0.99] hover:bg-white/75 dark:hover:bg-achira-navy/35"
            >
              <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-achira-blue/8 text-achira-blue dark:bg-achira-cream/10 dark:text-achira-cream">
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
