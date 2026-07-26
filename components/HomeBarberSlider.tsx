"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useBarbers } from "@/hooks/useBarbers";

export function HomeBarberSlider() {
  const { barbers } = useBarbers();
  const displayBarbers =
    barbers.length === 1
      ? Array.from({ length: 7 }, () => barbers[0])
      : barbers;
  return (
    <div className="mt-7 w-full text-left">
      <div className="mb-3 flex items-end justify-between gap-2 px-0.5">
        <div>
          <p className="premium-section-kicker">Барберууд</p>
          <p className="premium-section-title mt-1">Манай баг</p>
        </div>
        <Link href="/booking" className="cream-pill active:scale-[0.98]">
          Цаг авах
          <ChevronRight className="h-2.5 w-2.5" strokeWidth={1.5} />
        </Link>
      </div>
      <div className="relative -mx-3">
        {/* Edge fades (native carousel feel) */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-achira-cream to-transparent dark:from-achira-navy"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-achira-cream to-transparent dark:from-achira-navy"
          aria-hidden
        />

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-1 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {displayBarbers.map((b, i) => (
            <Link
              key={`${b.id}-${i}`}
              href="/booking"
              className="group/link w-[8.25rem] shrink-0 snap-start touch-manipulation sm:w-[8.75rem]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.85rem] border border-achira-gold/20 bg-white shadow-[0_18px_48px_rgba(21,58,112,0.12),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-black/[0.02] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/link:shadow-[0_22px_56px_rgba(21,58,112,0.16)] active:scale-[0.98] dark:border-achira-gold/12 dark:bg-white/[0.04] dark:shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                <Image
                  src={b.imageUrl}
                  alt={b.name}
                  fill
                  className="pointer-events-none object-cover transition-transform duration-500 group-hover/link:scale-[1.03]"
                  sizes="140px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                  <div className="rounded-full border border-white/25 bg-white/15 px-3.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-2xl backdrop-saturate-160">
                    <p className="line-clamp-1 text-[10px] font-semibold tracking-[0.01em] text-white">
                      {b.name}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[8.5px] font-medium text-white/70">
                      {b.title}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
