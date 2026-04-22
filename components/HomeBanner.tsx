import Image from "next/image";

export function HomeBanner() {
  return (
    <section className="mt-4 w-full">
      {/* Gradient frame + glow (modern highlight) */}
      <div className="relative rounded-[1.65rem] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.10),transparent_55%),linear-gradient(to_bottom_right,rgba(0,0,0,0.12),rgba(0,0,0,0.02),rgba(255,255,255,0))] p-[1px] shadow-[0_28px_110px_rgba(0,0,0,0.18)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.22),transparent_55%),linear-gradient(to_bottom_right,rgba(255,255,255,0.14),rgba(255,255,255,0.03),rgba(0,0,0,0))] dark:shadow-[0_28px_110px_rgba(0,0,0,0.75)]">
        <div className="relative overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/70 ring-1 ring-black/[0.05] backdrop-blur-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-[1px] hover:shadow-[0_28px_110px_rgba(0,0,0,0.22)] active:translate-y-0 active:scale-[0.99] dark:border-white/10 dark:bg-zinc-950/35 dark:ring-white/[0.06] dark:hover:shadow-[0_28px_110px_rgba(0,0,0,0.8)]">
          {/* Image */}
          <div className="relative h-44 w-full sm:h-56">
            <Image
              src="/home-banner-v4.png"
              alt="Blended banner"
              fill
              className="pointer-events-none object-cover object-center"
              sizes="(max-width:768px) 100vw, 1100px"
              priority
            />
          </div>

          {/* Modern overlays */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/55 via-white/10 to-transparent dark:from-black/60 dark:via-black/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_60%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.40),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.55),transparent_55%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/20 opacity-30 dark:bg-white/25"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(0,0,0,0.06),inset_0_-1px_0_rgba(255,255,255,0.65)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.55)]"
            aria-hidden
          />

          {/* Subtle corner accent */}
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-black/10 blur-2xl dark:bg-white/10"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

