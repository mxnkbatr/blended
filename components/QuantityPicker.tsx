"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityPicker({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid h-9 w-9 place-items-center rounded-xl text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
        aria-label="Хасах"
      >
        <Minus className="h-4 w-4" strokeWidth={1.25} />
      </button>
      <div className="min-w-10 px-2 text-center text-sm font-medium tabular-nums text-white">
        {value}
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid h-9 w-9 place-items-center rounded-xl text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
        aria-label="Нэмэх"
      >
        <Plus className="h-4 w-4" strokeWidth={1.25} />
      </button>
    </div>
  );
}

