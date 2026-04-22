import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { barbers } from "@/lib/data/barbers";

export function HomeBarberSlider() {
  return (
    <div className="mt-7 w-full text-left">
      <div className="mb-3 flex items-end justify-between gap-2 px-0.5">
        <div>
          <p className="text-[8px] font-medium uppercase tracking-[0.26em] text-zinc-600">
            Баберууд
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-display)] text-[12px] tracking-wide text-zinc-800 dark:text-zinc-300">
            Манай баг
          </p>
        </div>
        <Link
          href="/booking"
          className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-black/[0.02] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-zinc-700 transition-colors hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.06]"
        >
          Цаг авах
          <ChevronRight className="h-2.5 w-2.5" strokeWidth={1.25} />
        </Link>
      </div>
      <div className="relative -mx-3">
        {/* Edge fades (native carousel feel) */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent dark:from-black"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent dark:from-black"
          aria-hidden
        />

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-1 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {barbers.map((b) => (
            <Link
              key={b.id}
              href="/booking"
              className="group/link w-[8.25rem] shrink-0 snap-start touch-manipulation sm:w-[8.75rem]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.04] transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_18px_60px_rgba(0,0,0,0.45)] dark:ring-white/[0.06]">
                <Image
                  src={b.imageUrl}
                  alt={b.name}
                  fill
                  className="pointer-events-none object-cover transition-transform duration-500 group-hover/link:scale-[1.03]"
                  sizes="140px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/18 to-transparent dark:from-black/90 dark:via-black/22" />

                {/* iOS-style material pill */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                  <div className="rounded-2xl border border-white/20 bg-white/[0.10] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/[0.10] backdrop-blur-2xl backdrop-saturate-150">
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
