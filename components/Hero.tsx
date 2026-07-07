import Link from "next/link";
import { AchiraLogo } from "./AchiraLogo";
import { AchiraWordmark } from "./AchiraWordmark";
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
    value: "Хан уул дүүрэг, 15р хороо, 10р байр ",
    href: "https://maps.app.goo.gl/2DrMFTwCAZpE5Ln67?g_st=ii",
  },
  {
    label: "Утас",
    value: "88668612",
    href: "tel:88668612",
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-12%,rgba(30,79,150,0.10),transparent_58%),radial-gradient(ellipse_at_bottom,rgba(196,165,116,0.08),var(--color-achira-cream))] dark:bg-[radial-gradient(ellipse_90%_60%_at_50%_-12%,rgba(42,98,176,0.22),transparent_58%),radial-gradient(ellipse_at_bottom,rgba(15,26,46,0.92),var(--color-achira-navy))]"
        aria-hidden
      />

      {/* Гар утас — premium app-style */}
      <div className="relative mx-auto flex w-full max-w-md flex-col md:hidden">
        <HomeBanner />
        <HomeBarberSlider />
        <HomeBestSellerGrid />
      </div>

      {/* Desktop / notebook */}
      <div className="relative mx-auto hidden w-full max-w-3xl flex-col items-center text-center md:flex">
        <AchiraLogo className="mb-6 h-44 w-44 sm:h-52 sm:w-52" priority />
        <AchiraWordmark size="hero" />
        <p className="mt-6 max-w-md text-sm leading-relaxed text-achira-blue/70 dark:text-achira-cream/65 sm:text-base">
          Гар урлалын сэтгэлгээтэй Hairstylist — уламжлалт техник, орчин үеийн
          загвар, өөрийн онцлог стиль.
        </p>

        <div className="mt-12 grid w-full max-w-lg gap-3 sm:grid-cols-3 sm:gap-4">
          {infoDesktop.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-achira-blue/12 bg-achira-paper/60 px-4 py-4 text-left backdrop-blur-sm dark:border-achira-cream/10 dark:bg-achira-blue/10"
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-achira-blue/55 dark:text-achira-cream/50">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="mt-2 block text-sm text-achira-blue-dark transition-colors hover:text-achira-burgundy dark:text-achira-cream dark:hover:text-achira-cream"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-2 text-sm leading-snug text-achira-blue-dark dark:text-achira-cream">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 sm:mt-16">
          <Link
            href="/booking"
            className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-achira-blue px-10 py-4 text-sm font-semibold uppercase tracking-widest text-achira-cream shadow-[0_8px_32px_rgba(30,79,150,0.25)] transition-[transform,background-color] hover:bg-achira-blue-dark hover:scale-[1.02] active:scale-[0.98] dark:bg-achira-cream dark:text-achira-blue-dark dark:hover:bg-achira-paper"
          >
            Цаг авах
          </Link>
          <Link
            href="/shop"
            className="text-sm text-achira-blue/60 underline-offset-4 transition-colors hover:text-achira-burgundy hover:underline dark:text-achira-cream/60 dark:hover:text-achira-cream"
          >
            Дэлгүүр үзэх
          </Link>
        </div>
      </div>
    </section>
  );
}
