"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityPicker({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex items-center rounded-2xl border border-achira-blue/12 bg-white/80 p-1 dark:border-achira-cream/12 dark:bg-achira-navy/50">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid h-9 w-9 place-items-center rounded-xl text-achira-blue/70 transition-colors hover:bg-achira-blue/8 hover:text-achira-blue-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:text-achira-cream/70 dark:hover:bg-achira-cream/10 dark:hover:text-achira-cream"
        aria-label="Хасах"
      >
        <Minus className="h-4 w-4" strokeWidth={1.25} />
      </button>
      <div className="min-w-10 px-2 text-center text-sm font-medium tabular-nums text-achira-blue-dark dark:text-achira-cream">
        {value}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid h-9 w-9 place-items-center rounded-xl text-achira-blue/70 transition-colors hover:bg-achira-blue/8 hover:text-achira-blue-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:text-achira-cream/70 dark:hover:bg-achira-cream/10 dark:hover:text-achira-cream"
        aria-label="Нэмэх"
      >
        <Plus className="h-4 w-4" strokeWidth={1.25} />
      </button>
    </div>
  );
}
