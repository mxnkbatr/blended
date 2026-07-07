import Image from "next/image";

export function HomeBanner() {
  return (
    <section className="premium-hero-banner mt-4 w-full" aria-label="Achira Artist">
      <div className="premium-hero-frame">
        <div className="relative h-52 w-full overflow-hidden rounded-[1.6rem] sm:h-60">
          <Image
            src="/achira-hero-banner.png"
            alt="Achira Artist"
            fill
            priority
            className="object-cover object-[center_46%] scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 28rem"
          />

          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,247,0.08)_0%,transparent_38%,rgba(21,58,112,0.05)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,26,46,0.15)_0%,transparent_42%,rgba(0,0,0,0.28)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(21,58,112,0.07)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.35)_100%)]"
            aria-hidden
          />
          <div className="premium-grain pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/30 dark:ring-white/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-achira-burgundy/35 to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
