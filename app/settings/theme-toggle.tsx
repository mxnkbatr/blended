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
        className="inline-flex items-center rounded-2xl border border-black/10 bg-black/[0.02] p-1 opacity-60 dark:border-white/10 dark:bg-white/[0.03]"
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
      className="inline-flex items-center rounded-2xl border border-black/10 bg-black/[0.02] p-1 dark:border-white/10 dark:bg-white/[0.03]"
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
            ? "bg-white text-zinc-950 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            : "text-zinc-600 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
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
            ? "bg-zinc-950 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            : "text-zinc-600 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
        }`}
      >
        {t("dark")}
      </button>
    </div>
  );
}

