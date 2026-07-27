import type { StatusTone } from "@/lib/admin-labels";

const toneClass: Record<StatusTone, string> = {
  warning:
    "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  success:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  danger: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  info: "border-achira-blue/20 bg-achira-blue/8 text-achira-blue-dark dark:border-achira-cream/20 dark:bg-achira-cream/10 dark:text-achira-cream",
  muted:
    "border-achira-blue/10 bg-achira-paper/60 text-achira-blue/55 dark:border-achira-cream/10 dark:bg-achira-navy/40 dark:text-achira-cream/50",
  neutral:
    "border-achira-gold/20 bg-white/70 text-achira-blue-dark dark:border-achira-cream/12 dark:bg-achira-navy/50 dark:text-achira-cream",
};

export function AdminStatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${toneClass[tone]}`}
    >
      {label}
    </span>
  );
}
