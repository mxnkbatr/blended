"use client";

/** Instant swap — no fade/slide (web-like). Chrome stays put outside this. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
