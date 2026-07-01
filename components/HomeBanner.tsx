import Image from "next/image";

export function HomeBanner() {
  return (
    <section className="mt-4 w-full">
      <div className="relative rounded-[1.65rem] bg-[radial-gradient(ellipse_at_top,rgba(30,79,150,0.14),transparent_55%),linear-gradient(to_bottom_right,rgba(30,79,150,0.10),rgba(244,239,230,0.5))] p-[1px] shadow-[0_28px_80px_rgba(30,79,150,0.15)] dark:bg-[radial-gradient(ellipse_at_top,rgba(42,98,176,0.30),transparent_55%),linear-gradient(to_bottom_right,rgba(42,98,176,0.15),rgba(15,26,46,0.8))] dark:shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
        <div className="relative overflow-hidden rounded-[1.6rem] border border-achira-blue/12 bg-achira-cream ring-1 ring-achira-blue/5 backdrop-blur-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-[1px] hover:shadow-[0_28px_80px_rgba(30,79,150,0.20)] active:translate-y-0 active:scale-[0.99] dark:border-achira-cream/10 dark:bg-achira-navy dark:ring-achira-cream/5">
          <div className="relative flex h-52 w-full flex-col items-center justify-center px-6 py-8 sm:h-60">
            <Image
              src="/achira-logo.png"
              alt="Achira Artist"
              width={200}
              height={280}
              className="h-36 w-auto object-contain sm:h-40"
              sizes="(max-width:768px) 60vw, 200px"
              priority
            />
            <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.45em] text-achira-blue/55 dark:text-achira-cream/55">
              ✦ Artist ✦
            </p>
          </div>

          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(244,239,230,0.55),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_bottom,rgba(15,26,46,0.55),transparent_60%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-achira-blue/10 blur-2xl dark:bg-achira-blue-light/15"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
