"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Newspaper } from "lucide-react";
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
    void fetchPublishedNews(8).then((data) => {
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
      <section className="mt-7 w-full text-left">
        <div className="mb-3 flex items-end justify-between gap-2 px-0.5">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-achira-paper/70 dark:bg-achira-blue/10" />
          <div className="h-7 w-16 animate-pulse rounded-full bg-achira-paper/70 dark:bg-achira-blue/10" />
        </div>
        <div className="relative -mx-3">
          <div className="flex gap-3 overflow-hidden px-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] w-[8.25rem] shrink-0 animate-pulse rounded-[1.85rem] bg-achira-paper/70 dark:bg-achira-blue/10 sm:w-[8.75rem]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="mt-7 w-full text-left" aria-label="Мэдээ мэдээлэл">
      <div className="mb-3 flex items-end justify-between gap-2 px-0.5">
        <h2 className="premium-section-title">Мэдээ мэдээлэл</h2>
        <Link href="/news" className="cream-pill active:scale-[0.98]">
          Бүгд
          <ChevronRight className="h-2.5 w-2.5" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="relative -mx-3">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-achira-cream to-transparent dark:from-achira-navy"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-achira-cream to-transparent dark:from-achira-navy"
          aria-hidden
        />

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-1 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group/link w-[8.25rem] shrink-0 snap-start touch-manipulation sm:w-[8.75rem]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.85rem] border border-achira-gold/20 bg-gradient-to-b from-white to-achira-paper/80 shadow-[0_18px_48px_rgba(21,58,112,0.12),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-black/[0.02] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/link:shadow-[0_22px_56px_rgba(21,58,112,0.16)] active:scale-[0.98] dark:border-achira-gold/12 dark:from-achira-navy/60 dark:to-achira-blue/20 dark:shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt=""
                    fill
                    className="pointer-events-none object-cover transition-transform duration-500 group-hover/link:scale-[1.03]"
                    sizes="140px"
                  />
                ) : (
                  <div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,170,120,0.28),transparent_55%),linear-gradient(165deg,#fbf8f2,var(--color-achira-paper))] dark:bg-[radial-gradient(ellipse_at_30%_20%,rgba(42,98,176,0.25),transparent_55%),linear-gradient(165deg,var(--color-achira-navy),var(--color-achira-blue))]"
                    aria-hidden
                  >
                    <Newspaper
                      className="h-8 w-8 text-achira-blue/30 dark:text-achira-cream/30"
                      strokeWidth={1.15}
                    />
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                  <div className="rounded-full border border-white/25 bg-white/15 px-3.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-2xl backdrop-saturate-160">
                    <p className="line-clamp-2 text-[10px] font-semibold leading-snug tracking-[0.01em] text-white">
                      {post.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[8.5px] font-medium text-white/70">
                      {formatNewsDate(post.publishedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
