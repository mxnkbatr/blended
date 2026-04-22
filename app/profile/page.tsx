import Link from "next/link";
import { ChevronRight, Settings, User } from "lucide-react";

export const metadata = {
  title: "Профайл",
  description: "Хэрэглэгчийн профайл",
};

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-md px-4 py-8 md:py-12">
      <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/30">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-black/[0.02] text-zinc-500 dark:border-white/10 dark:bg-white/5">
          <User className="h-7 w-7" strokeWidth={1.25} />
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-xl tracking-wide text-zinc-950 dark:text-white md:text-2xl">
          Профайл
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          Нэвтрэлт, захиалгын түүх зэргийг энд холбож болно. Одоогоор UI-ийн
          placeholder.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-2 dark:border-white/10 dark:bg-white/[0.03]">
        <Link
          href="/settings"
          className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-black/[0.03] active:scale-[0.99] dark:hover:bg-white/[0.05]"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 bg-white text-zinc-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-white">
              <Settings className="h-4 w-4" strokeWidth={1.35} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                Тохиргоо
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Light / Dark theme
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400" strokeWidth={1.35} />
        </Link>
      </div>
    </main>
  );
}
