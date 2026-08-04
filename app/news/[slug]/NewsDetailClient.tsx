"use client";

import Link from "next/link";
import { use } from "react";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  fetchNewsBySlug,
  formatNewsDate,
  type NewsPost,
} from "@/lib/supabase/news";

export function NewsDetailClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    void fetchNewsBySlug(slug).then((data) => {
      if (!cancelled) {
        setPost(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <main className="relative mx-auto min-h-[70dvh] w-full max-w-2xl px-4 pb-28 pt-5 sm:px-6 md:pb-16 md:pt-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_45%_at_15%_0%,rgba(201,170,120,0.18),transparent_52%),linear-gradient(180deg,#fbf8f2_0%,var(--color-achira-cream)_50%,color-mix(in_srgb,var(--color-achira-paper)_30%,var(--color-achira-cream))_100%)] dark:bg-[radial-gradient(ellipse_60%_40%_at_20%_0%,rgba(42,98,176,0.18),transparent_50%),linear-gradient(180deg,var(--color-achira-navy),color-mix(in_srgb,var(--color-achira-navy)_90%,black))]"
        aria-hidden
      />

      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-sm text-achira-blue/50 transition-colors hover:text-achira-blue-dark dark:text-achira-cream/50 dark:hover:text-achira-cream"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Буцах
      </Link>

      {loading ? (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-gradient-to-b from-white/60 to-achira-paper/70 dark:from-achira-blue/10 dark:to-achira-navy/40" />
      ) : !post ? (
        <div className="mt-8 rounded-2xl border border-achira-gold/15 bg-gradient-to-b from-white/70 to-achira-paper/40 px-6 py-12 text-center dark:border-achira-cream/8 dark:from-achira-navy/40 dark:to-achira-blue/10">
          <p className="text-sm text-achira-blue/55 dark:text-achira-cream/50">
            Мэдээ олдсонгүй.
          </p>
          <Link
            href="/news"
            className="mt-4 inline-block text-sm text-achira-blue underline-offset-4 hover:underline dark:text-achira-cream"
          >
            Жагсаалт руу
          </Link>
        </div>
      ) : (
        <article className="mt-7">
          <div className="h-px w-10 bg-gradient-to-r from-achira-gold/70 to-transparent" />
          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/40 dark:text-achira-cream/35">
            {formatNewsDate(post.publishedAt)}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[1.85rem] leading-tight text-achira-blue-dark dark:text-achira-cream md:text-4xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-base leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
              {post.excerpt}
            </p>
          ) : null}

          {post.coverImageUrl ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-achira-gold/15 shadow-[0_18px_48px_rgba(21,58,112,0.08)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImageUrl}
                alt=""
                className="h-56 w-full object-cover sm:h-72"
              />
            </div>
          ) : null}

          <div className="mt-8 rounded-2xl border border-achira-gold/14 bg-gradient-to-b from-white/75 to-achira-paper/40 px-5 py-6 shadow-[0_14px_40px_rgba(21,58,112,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-achira-cream/8 dark:from-achira-navy/45 dark:to-achira-blue/10 sm:px-7 sm:py-8">
            <div className="whitespace-pre-wrap text-[15px] leading-7 text-achira-ink/90 dark:text-achira-cream/85">
              {post.body}
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
