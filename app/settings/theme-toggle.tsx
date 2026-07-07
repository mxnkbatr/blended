"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="inline-flex items-center rounded-2xl border border-achira-blue/12 bg-achira-cream/60 p-1 opacity-60 dark:border-achira-cream/10 dark:bg-achira-navy/60"
        aria-label="Theme"
      >
        <div className="h-9 w-[4.25rem]" />
        <div className="h-9 w-[4.25rem]" />
      </div>
    );
  }

  const value = resolvedTheme === "light" ? "light" : "dark";

  return (
    <div
      className="inline-flex items-center rounded-2xl border border-achira-blue/12 bg-achira-cream/60 p-1 dark:border-achira-cream/10 dark:bg-achira-navy/60"
      role="radiogroup"
      aria-label="Theme"
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === "light"}
        onClick={() => setTheme("light")}
        className={`min-w-[4.25rem] rounded-xl px-3 py-2 text-[11px] font-semibold tracking-wide transition-colors active:scale-[0.99] ${
          value === "light"
            ? "bg-white text-achira-blue-dark shadow-[0_10px_30px_rgba(21,58,112,0.10)]"
            : "text-achira-blue/55 hover:text-achira-blue dark:text-achira-cream/55 dark:hover:text-achira-cream"
        }`}
      >
        {t("light")}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === "dark"}
        onClick={() => setTheme("dark")}
        className={`min-w-[4.25rem] rounded-xl px-3 py-2 text-[11px] font-semibold tracking-wide transition-colors active:scale-[0.99] ${
          value === "dark"
            ? "bg-achira-navy text-achira-cream shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
            : "text-achira-blue/55 hover:text-achira-blue dark:text-achira-cream/55 dark:hover:text-achira-cream"
        }`}
      >
        {t("dark")}
      </button>
    </div>
  );
}
