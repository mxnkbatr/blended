"use client";

import Image from "next/image";
import Link from "next/link";
import { useBarbers } from "@/hooks/useBarbers";

export function HomeBarberSlider() {
  const { barbers } = useBarbers();
  const displayBarbers = barbers;
  return (
    <div className="mt-6 w-full text-left">
      <div className="mb-3 flex items-end justify-between gap-2 px-0.5">
        <div>
          <p className="text-[13px] font-semibold tracking-[-0.01em] text-achira-cream">
            Манай баг
          </p>
          <p className="mt-0.5 text-[12px] text-achira-cream/45">Барберууд</p>
        </div>
        <Link
          href="/booking"
          className="text-[13px] font-medium text-achira-blue-light active:opacity-60"
        >
          Бүгд
        </Link>
      </div>
      <div className="relative -mx-4">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {displayBarbers.map((b, i) => (
            <Link
              key={`${b.id}-${i}`}
              href="/booking"
              className="group/link w-[7.75rem] shrink-0 snap-start touch-manipulation sm:w-[8.5rem]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-achira-blue/20 ring-1 ring-white/[0.08] transition-transform active:scale-[0.97]">
                <Image
                  src={b.imageUrl}
                  alt={b.name}
                  fill
                  className="pointer-events-none object-cover"
                  sizes="140px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                  <p className="line-clamp-1 text-[13px] font-semibold tracking-[-0.01em] text-white">
                    {b.name}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-white/65">
                    {b.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
