import Link from "next/link";
import { Search, UserRound } from "lucide-react";
import { BlendedMark } from "./BlendedMark";
import { CartNavLink } from "./CartNavLink";

const links = [
  { href: "/", label: "Нүүр" },
  { href: "/shop", label: "Бүх бараа" },
  { href: "/booking", label: "Цаг авах" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 hidden border-b border-zinc-800/80 bg-black/80 backdrop-blur-md md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 text-white transition-opacity hover:opacity-90"
        >
          <BlendedMark className="h-7 w-12 text-white" />
          <span className="font-[family-name:var(--font-display)] text-lg tracking-[0.2em]">
            BLENDED
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-zinc-400">
            <Search className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            <span className="text-xs text-zinc-500">Хайх (жишээ UI)</span>
          </div>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white sm:px-4"
            >
              {l.label}
            </Link>
          ))}
          <CartNavLink />
          <Link
            href="/profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
            aria-label="Профайл"
          >
            <UserRound className="h-4 w-4" strokeWidth={1.25} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
