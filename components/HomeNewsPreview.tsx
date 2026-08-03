"use client";

import Image from "next/image";
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
      <section className="mt-6 w-full text-left">
        <div className="mb-3 flex items-end justify-between gap-2 px-0.5">
          <div className="h-5 w-28 animate-pulse rounded-md bg-white/10" />
          <div className="h-4 w-10 animate-pulse rounded-md bg-white/10" />
        </div>
        <div className="relative -mx-4">
          <div className="flex gap-3 overflow-hidden px-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] w-[7.75rem] shrink-0 animate-pulse rounded-[1.25rem] bg-white/8 sm:w-[8.5rem]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="mt-6 w-full text-left" aria-label="Мэдээ мэдээлэл">
      <div className="mb-3 flex items-end justify-between gap-2 px-0.5">
        <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-achira-cream">
          Мэдээ мэдээлэл
        </h2>
        <Link
          href="/news"
          className="text-[13px] font-medium text-achira-blue-light active:opacity-60"
        >
          Бүгд
        </Link>
      </div>

      <div className="relative -mx-4">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group/link w-[7.75rem] shrink-0 snap-start touch-manipulation sm:w-[8.5rem]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-achira-blue/20 ring-1 ring-white/[0.08] transition-transform active:scale-[0.97]">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt=""
                    fill
                    className="pointer-events-none object-cover"
                    sizes="140px"
                  />
                ) : (
                  <div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-achira-navy to-achira-blue"
                    aria-hidden
                  >
                    <Newspaper
                      className="h-8 w-8 text-achira-cream/30"
                      strokeWidth={1.15}
                    />
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                  <p className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-[-0.01em] text-white">
                    {post.title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-white/65">
                    {formatNewsDate(post.publishedAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
