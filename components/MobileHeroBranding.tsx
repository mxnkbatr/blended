"use client";

import { motion } from "framer-motion";
import { BlendedMark } from "./BlendedMark";
import { useMobileHomeScrolled } from "./providers/MobileHomeScrollProvider";

const layoutSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.55,
};

export function MobileHeroBranding() {
  const scrolled = useMobileHomeScrolled();

  if (scrolled) {
    return <div className="h-0 shrink-0" aria-hidden />;
  }

  return (
    <div className="mb-1 overflow-visible text-center">
      <BlendedMark className="mx-auto mb-2.5 h-9 w-[3.65rem] text-white/90" />
      <p className="text-[8px] font-medium uppercase tracking-[0.34em] text-zinc-600">
        Barbershop
      </p>
      <motion.h1
        layoutId="mobile-blended-title"
        className="mt-1.5 font-[family-name:var(--font-display)] text-[1.65rem] font-normal leading-none tracking-[0.2em] text-white"
        transition={layoutSpring}
      >
        BLENDED
      </motion.h1>
      <p className="mx-auto mt-2.5 max-w-[16rem] text-[10px] leading-relaxed text-zinc-500">
        Тансаг, минималист орчинд уламжлалт гар урлал болон орчин үеийн
        загварыг нэгтгэнэ.
      </p>
    </div>
  );
}
