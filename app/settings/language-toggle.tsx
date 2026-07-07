"use client";

import { useEffect, useState } from "react";
import { useI18n, type Lang } from "@/components/providers/LanguageProvider";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="inline-flex items-center rounded-2xl border border-black/10 bg-black/[0.02] p-1 opacity-60"
        aria-label="Language"
      >
        <div className="h-9 w-[4.25rem]" />
        <div className="h-9 w-[4.25rem]" />
      </div>
    );
  }

  const value: Lang = lang;

  return (
    <div
      className="inline-flex items-center rounded-2xl border border-black/10 bg-black/[0.02] p-1"
      role="radiogroup"
      aria-label="Language"
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === "mn"}
        onClick={() => setLang("mn")}
        className={`min-w-[4.25rem] rounded-xl px-3 py-2 text-[11px] font-semibold tracking-wide transition-colors active:scale-[0.99] ${
          value === "mn"
            ? "bg-white text-zinc-950 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            : "text-zinc-600 hover:text-zinc-800"
        }`}
      >
        Монгол
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === "en"}
        onClick={() => setLang("en")}
        className={`min-w-[4.25rem] rounded-xl px-3 py-2 text-[11px] font-semibold tracking-wide transition-colors active:scale-[0.99] ${
          value === "en"
            ? "bg-zinc-950 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            : "text-zinc-600 hover:text-zinc-800"
        }`}
      >
        English
      </button>
    </div>
  );
}

