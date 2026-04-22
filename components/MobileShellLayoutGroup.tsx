"use client";

import { LayoutGroup } from "framer-motion";

/** Нүүр дээр BLENDED layoutId анимац (header ↔ hero) */
export function MobileShellLayoutGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutGroup id="blended-mobile-brand">{children}</LayoutGroup>;
}
