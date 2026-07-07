"use client";

export function AdminFeedback({
  success,
  error,
  className = "",
}: {
  success?: string | null;
  error?: string | null;
  className?: string;
}) {
  if (!success && !error) return null;

  if (success) {
    return (
      <p className={`rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300 ${className}`}>
        {success}
      </p>
    );
  }

  return (
    <p className={`rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300 ${className}`}>
      {error}
    </p>
  );
}
