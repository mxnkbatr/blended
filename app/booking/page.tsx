import { BookingSystem } from "@/components/BookingSystem";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Цаг авах",
  description: "Achira Artist babershop — цаг захиалга",
};

const infoCards = [
  {
    label: "Цагийн хуваарь",
    value: "10:00 — 22:00",
    Icon: Clock,
  },
  {
    label: "Хаяг",
    value: "120k Regis Place, 3 давхар",
    href: "https://maps.app.goo.gl/2DrMFTwCAZpE5Ln67?g_st=ii",
    Icon: MapPin,
  },
  {
    label: "Захиалга",
    value: "1 цагийн зайтай",
    Icon: CalendarDays,
  },
] as const;

export default function BookingPage() {
  return (
    <main className="relative min-h-[calc(100dvh-4rem)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-5%,rgba(30,79,150,0.11),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(30,79,150,0.05),var(--color-achira-cream))] dark:bg-[radial-gradient(ellipse_90%_50%_at_50%_-5%,rgba(42,98,176,0.22),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(15,26,46,0.9),var(--color-achira-navy))]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-14 lg:py-20">
        <header className="md:text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-achira-blue/55 dark:text-achira-cream/50">
            Booking
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-normal tracking-[0.08em] text-achira-blue-dark dark:text-achira-cream sm:text-5xl lg:text-6xl">
            Цаг авах
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60 md:text-base">
            Baber сонгож, өдөр болон цагаа сонгоно уу. Баталгаажуулахад нэр, утас
            шаардлагатай.
          </p>
        </header>

        <div className="mx-auto mt-8 hidden max-w-3xl gap-3 md:grid md:grid-cols-3 md:gap-4">
          {infoCards.map(({ label, value, href, Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-achira-blue/12 bg-achira-paper/60 px-4 py-4 text-left backdrop-blur-sm dark:border-achira-cream/10 dark:bg-achira-blue/10"
            >
              <div className="flex items-center gap-2">
                <Icon
                  className="h-3.5 w-3.5 text-achira-blue/50 dark:text-achira-cream/45"
                  strokeWidth={1.5}
                />
                <p className="text-[10px] font-medium uppercase tracking-widest text-achira-blue/55 dark:text-achira-cream/50">
                  {label}
                </p>
              </div>
              {href ? (
                <Link
                  className="mt-2 inline-flex text-sm leading-snug text-achira-blue-dark underline decoration-achira-blue/25 underline-offset-4 transition-colors hover:text-achira-burgundy hover:decoration-achira-burgundy/40 dark:text-achira-cream dark:decoration-achira-cream/25 dark:hover:text-achira-cream"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {value}
                </Link>
              ) : (
                <p className="mt-2 text-sm leading-snug text-achira-blue-dark dark:text-achira-cream">
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pb-4 md:mt-12">
          <BookingSystem />
        </div>
      </div>
    </main>
  );
}
