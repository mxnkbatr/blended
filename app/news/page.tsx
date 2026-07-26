"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";
import {
  fetchPublishedNews,
  formatNewsDate,
  type NewsPost,
} from "@/lib/supabase/news";

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchPublishedNews().then((data) => {
      if (!cancelled) {
        setPosts(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="relative mx-auto min-h-[70dvh] w-full max-w-3xl px-4 pb-28 pt-5 sm:px-6 md:pb-16 md:pt-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_55%_at_50%_-8%,rgba(201,170,120,0.22),transparent_58%),radial-gradient(ellipse_50%_40%_at_100%_20%,rgba(28,74,140,0.06),transparent_50%),linear-gradient(180deg,#fbf8f2_0%,var(--color-achira-cream)_45%,color-mix(in_srgb,var(--color-achira-paper)_35%,var(--color-achira-cream))_100%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(42,98,176,0.22),transparent_55%),linear-gradient(180deg,var(--color-achira-navy),color-mix(in_srgb,var(--color-achira-navy)_90%,black))]"
        aria-hidden
      />

      <header className="mb-9">
        <div className="h-px w-10 bg-gradient-to-r from-achira-gold/70 to-transparent" />
        <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.28em] text-achira-blue/40 dark:text-achira-cream/40">
          Achira
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-[1.85rem] leading-tight tracking-tight text-achira-blue-dark dark:text-achira-cream md:text-4xl">
          Мэдээ мэдээлэл
        </h1>
        <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-achira-blue/55 dark:text-achira-cream/50">
          Шинэчлэл, урамшуулал, салбарын мэдээ.
        </p>
      </header>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-gradient-to-b from-white/60 to-achira-paper/70 dark:from-achira-blue/10 dark:to-achira-navy/40"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-achira-gold/15 bg-gradient-to-b from-white/70 to-achira-paper/40 px-6 py-16 text-center dark:border-achira-cream/8 dark:from-achira-navy/40 dark:to-achira-blue/10">
          <Newspaper
            className="h-7 w-7 text-achira-blue/30 dark:text-achira-cream/30"
            strokeWidth={1.25}
          />
          <p className="mt-4 text-sm text-achira-blue/55 dark:text-achira-cream/50">
            Одоогоор нийтлэгдсэн мэдээ байхгүй.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post, index) => (
            <li key={post.id}>
              <Link
                href={`/news/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-achira-gold/14 bg-gradient-to-b from-white/75 to-achira-paper/45 shadow-[0_14px_40px_rgba(21,58,112,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] transition-[transform,box-shadow,border-color] hover:border-achira-gold/28 hover:shadow-[0_18px_48px_rgba(21,58,112,0.09)] active:scale-[0.995] dark:border-achira-cream/8 dark:from-achira-navy/45 dark:to-achira-blue/10 dark:hover:border-achira-cream/14"
              >
                {post.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImageUrl}
                    alt=""
                    className="h-40 w-full object-cover sm:h-48"
                  />
                ) : (
                  <div
                    className="h-1 w-full bg-gradient-to-r from-achira-gold/35 via-achira-champagne/50 to-achira-blue/15"
                    aria-hidden
                  />
                )}
                <div className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-achira-blue/40 dark:text-achira-cream/35">
                      {formatNewsDate(post.publishedAt)}
                    </span>
                    {index === 0 ? (
                      <span className="text-[9px] uppercase tracking-[0.16em] text-achira-gold/80">
                        Шинэ
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-snug text-achira-blue-dark transition-colors group-hover:text-achira-blue dark:text-achira-cream dark:group-hover:text-achira-cream">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-achira-blue/60 dark:text-achira-cream/55">
                      {post.excerpt}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
