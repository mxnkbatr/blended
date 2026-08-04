"use client";

import { AchiraLogo } from "./AchiraLogo";
import { AchiraWordmark } from "./AchiraWordmark";
import { useMobileHomeScrolled } from "./providers/MobileHomeScrollProvider";

export function MobileHeroBranding() {
  const scrolled = useMobileHomeScrolled();

  if (scrolled) {
    return <div className="h-0 shrink-0" aria-hidden />;
  }

  return (
    <div className="mb-1 overflow-visible text-center">
      <AchiraLogo className="mx-auto mb-2 h-24 w-24" />
      <div>
        <AchiraWordmark size="lg" />
      </div>
      <p className="mx-auto mt-2.5 max-w-[16rem] text-[10px] leading-relaxed text-achira-blue/60 dark:text-achira-cream/55">
        Гар урлалын сэтгэлгээтэй barbershop — уламжлалт техник, орчин үеийн
        загвар.
      </p>
    </div>
  );
}
