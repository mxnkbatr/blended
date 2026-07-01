type Size = "sm" | "md" | "lg" | "hero";

const sizeClasses: Record<
  Size,
  { achira: string; artist: string; gap: string }
> = {
  sm: {
    achira: "text-[10px] tracking-[0.28em]",
    artist: "text-[6px] tracking-[0.42em]",
    gap: "gap-0",
  },
  md: {
    achira: "text-sm tracking-[0.22em]",
    artist: "text-[7px] tracking-[0.38em]",
    gap: "gap-0",
  },
  lg: {
    achira: "text-2xl tracking-[0.16em]",
    artist: "text-[9px] tracking-[0.45em]",
    gap: "gap-0.5",
  },
  hero: {
    achira: "text-5xl sm:text-6xl md:text-7xl tracking-[0.1em]",
    artist: "text-[10px] sm:text-xs tracking-[0.5em]",
    gap: "gap-1",
  },
};

export function AchiraWordmark({
  size = "md",
  className = "",
  light = false,
}: {
  size?: Size;
  className?: string;
  light?: boolean;
}) {
  const s = sizeClasses[size];
  const achiraColor = light
    ? "text-achira-cream"
    : "text-achira-blue dark:text-achira-cream";
  const artistColor = light
    ? "text-achira-cream/75"
    : "text-achira-blue/70 dark:text-achira-cream/70";

  return (
    <div className={`flex flex-col items-center ${s.gap} ${className}`}>
      <span
        className={`font-[family-name:var(--font-display)] font-medium uppercase ${s.achira} ${achiraColor}`}
      >
        ACHIRA
      </span>
      <span
        className={`flex items-center gap-1.5 font-medium uppercase ${s.artist} ${artistColor}`}
      >
        <span aria-hidden className="text-achira-burgundy">
          ✦
        </span>
        Artist
        <span aria-hidden className="text-achira-burgundy">
          ✦
        </span>
      </span>
    </div>
  );
}
