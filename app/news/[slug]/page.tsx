"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  fetchNewsBySlug,
  formatNewsDate,
  type NewsPost,
} from "@/lib/supabase/news";

export default function NewsDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params.slug === "string" ? params.slug : "";
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
    <main className="relative mx-auto min-h-[70dvh] w-full max-w-2xl px-4 pb-28 pt-6 sm:px-6 md:pb-16 md:pt-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_45%_at_20%_0%,rgba(196,165,116,0.16),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(235,228,216,0.5),var(--color-achira-cream))] dark:bg-none"
        aria-hidden
      />

      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-sm text-achira-blue/60 transition-colors hover:text-achira-blue-dark dark:text-achira-cream/55 dark:hover:text-achira-cream"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Мэдээ рүү буцах
      </Link>

      {loading ? (
        <div className="mt-8 h-64 animate-pulse rounded-3xl bg-achira-paper/80 dark:bg-achira-blue/10" />
      ) : !post ? (
        <div className="premium-card mt-8 px-6 py-12 text-center">
          <p className="text-sm text-achira-blue/60 dark:text-achira-cream/55">
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
        <article className="mt-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/45 dark:text-achira-cream/40">
            {formatNewsDate(post.publishedAt)}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight text-achira-blue-dark dark:text-achira-cream md:text-4xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-base leading-relaxed text-achira-blue/70 dark:text-achira-cream/65">
              {post.excerpt}
            </p>
          ) : null}

          {post.coverImageUrl ? (
            <div className="premium-hero-frame mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImageUrl}
                alt=""
                className="h-56 w-full rounded-[1.6rem] object-cover sm:h-72"
              />
            </div>
          ) : null}

          <div className="premium-card mt-8 px-5 py-6 sm:px-7 sm:py-8">
            <div className="whitespace-pre-wrap text-[15px] leading-7 text-achira-ink/90 dark:text-achira-cream/85">
              {post.body}
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
