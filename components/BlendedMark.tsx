export function BlendedMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M60 58c-8-10-28-18-44-10C6 52 2 38 8 26c6-14 22-22 38-22 6 0 10 2 14 6 4-4 8-6 14-6 16 0 32 8 38 22 6 12 2 26-8 22-16-8-36 0-44 10Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        className="opacity-90"
      />
      <path
        d="M22 34c4-14 18-22 32-22 4 0 8 1 12 3M98 34c-4-14-18-22-32-22-4 0-8 1-12 3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M18 40c-6 8-4 18 6 20M102 40c6 8 4 18-6 20"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
