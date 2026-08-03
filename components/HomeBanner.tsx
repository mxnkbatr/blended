import Image from "next/image";

export function HomeBanner() {
  return (
    <section className="mt-1 w-full" aria-label="Achira Artist">
      <div className="relative h-[13.5rem] w-full overflow-hidden rounded-[1.35rem] sm:h-64 sm:rounded-[2.65rem]">
        <Image
          src="/achira-hero-banner.png"
          alt="Achira Artist"
          fill
          priority
          className="object-cover object-[center_46%]"
          sizes="(max-width: 768px) 100vw, 28rem"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-achira-navy/55 via-transparent to-achira-navy/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
          aria-hidden
        />
      </div>
    </section>
  );
}
