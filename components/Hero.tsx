import Link from "next/link";
import { BlendedMark } from "./BlendedMark";
import { HomeBanner } from "./HomeBanner";
import { HomeBarberSlider } from "./HomeBarberSlider";
import { HomeBestSellerGrid } from "./HomeBestSellerGrid";

const infoDesktop: {
  label: string;
  value: string;
  href?: string;
}[] = [
  {
    label: "Хаяг",
    value: "120k Regis Place, 3 давхар, Улаанбаатар",
  },
  {
    label: "Утас",
    value: "77757747",
    href: "tel:77757747",
  },
  {
    label: "Цагийн хуваарь",
    value: "10:00 — 22:00",
  },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-8.5rem)] flex-col justify-center px-4 pb-6 pt-3 md:min-h-[calc(100dvh-4rem)] md:px-8 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(24,24,27,0.08),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.04),rgba(255,255,255,0.92))] dark:bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(63,63,70,0.35),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(24,24,27,0.9),#000)] md:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] md:from-zinc-800/10 md:via-white md:to-white dark:md:from-zinc-800/40 dark:md:via-black dark:md:to-black"
        aria-hidden
      />

      {/* Гар утас — premium app-style */}
      <div className="relative mx-auto flex w-full max-w-md flex-col md:hidden">
        <HomeBanner />
        <HomeBarberSlider />
        <HomeBestSellerGrid />
      </div>

      {/* Desktop / notebook — анхны landing загвар */}
      <div className="relative mx-auto hidden w-full max-w-3xl flex-col items-center text-center md:flex">
        <BlendedMark className="mb-8 h-16 w-28 text-white sm:h-20 sm:w-36" />
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500">
          Barbershop
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl font-normal tracking-[0.12em] text-white sm:text-6xl md:text-7xl">
          BLENDED
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
          Тансаг, минималист орчинд уламжлалт гар урлал болон орчин үеийн
          загварыг нэгтгэнэ.
        </p>

        <div className="mt-12 grid w-full max-w-lg gap-3 sm:grid-cols-3 sm:gap-4">
          {infoDesktop.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-4 text-left backdrop-blur-sm"
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="mt-2 block text-sm text-zinc-100 transition-colors hover:text-white"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-2 text-sm leading-snug text-zinc-100">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 sm:mt-16">
          <Link
            href="/booking"
            className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-semibold uppercase tracking-widest text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Цаг авах
          </Link>
          <Link
            href="/shop"
            className="text-sm text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-300 hover:underline"
          >
            Дэлгүүр үзэх
          </Link>
        </div>
      </div>
    </section>
  );
}
