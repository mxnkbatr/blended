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
    <main className="relative mx-auto min-h-[70dvh] w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 md:pb-16 md:pt-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(196,165,116,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(235,228,216,0.55),var(--color-achira-cream))] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(42,98,176,0.2),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(15,26,46,0.9),var(--color-achira-navy))]"
        aria-hidden
      />

      <header className="mb-8">
        <p className="premium-section-kicker">Achira</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-achira-blue-dark dark:text-achira-cream md:text-4xl">
          Мэдээ мэдээлэл
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-achira-blue/60 dark:text-achira-cream/55">
          Шинэчлэл, урамшуулал, салбарын мэдээг эндээс уншина уу.
        </p>
      </header>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-3xl bg-achira-paper/80 dark:bg-achira-blue/10"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="premium-card flex flex-col items-center px-6 py-14 text-center">
          <Newspaper
            className="h-8 w-8 text-achira-blue/35 dark:text-achira-cream/35"
            strokeWidth={1.25}
          />
          <p className="mt-4 text-sm text-achira-blue/60 dark:text-achira-cream/55">
            Одоогоор нийтлэгдсэн мэдээ байхгүй.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/news/${post.slug}`}
                className="premium-card block overflow-hidden transition-[transform,box-shadow] hover:shadow-[0_22px_70px_rgba(21,58,112,0.12)] active:scale-[0.995]"
              >
                {post.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImageUrl}
                    alt=""
                    className="h-40 w-full object-cover sm:h-48"
                  />
                ) : null}
                <div className="px-5 py-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/45 dark:text-achira-cream/40">
                    {formatNewsDate(post.publishedAt)}
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl text-achira-blue-dark dark:text-achira-cream">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
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
