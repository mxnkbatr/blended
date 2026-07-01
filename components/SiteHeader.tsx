"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, UserRound } from "lucide-react";
import { AchiraLogo } from "./AchiraLogo";
import { AchiraWordmark } from "./AchiraWordmark";
import { AuthNavLinks } from "./AuthNavLinks";
import { CartNavLink } from "./CartNavLink";

const links = [
  { href: "/", label: "Нүүр" },
  { href: "/shop", label: "Бүх бараа" },
  { href: "/booking", label: "Цаг авах" },
];

export function SiteHeader() {
  const pathname = usePathname();
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 hidden border-b border-achira-blue/10 bg-achira-cream/90 backdrop-blur-md md:block dark:border-achira-blue/20 dark:bg-achira-navy/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-achira-blue transition-opacity hover:opacity-90 dark:text-achira-cream"
        >
          <AchiraLogo className="h-9 w-9" />
          <AchiraWordmark size="md" className="items-start" />
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-achira-blue/12 bg-achira-paper/50 px-4 py-2 text-achira-blue/60 dark:border-achira-cream/10 dark:bg-achira-blue/10 dark:text-achira-cream/60">
            <Search className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            <span className="text-xs">Хайх (жишээ UI)</span>
          </div>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm text-achira-blue/80 transition-colors hover:bg-achira-blue/8 hover:text-achira-blue-dark dark:text-achira-cream/80 dark:hover:bg-achira-cream/8 dark:hover:text-achira-cream sm:px-4"
            >
              {l.label}
            </Link>
          ))}
          <CartNavLink />
          <AuthNavLinks />
          <Link
            href="/profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-achira-blue/12 bg-achira-paper/40 text-achira-blue/80 transition-colors hover:border-achira-blue/20 hover:bg-achira-blue/8 hover:text-achira-blue-dark dark:border-achira-cream/10 dark:bg-achira-cream/5 dark:text-achira-cream/80 dark:hover:border-achira-cream/20 dark:hover:bg-achira-cream/10 dark:hover:text-achira-cream"
            aria-label="Профайл"
          >
            <UserRound className="h-4 w-4" strokeWidth={1.25} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
