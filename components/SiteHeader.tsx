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
  { href: "/news", label: "Мэдээ" },
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
    <header className="sticky top-0 z-50 hidden border-b border-achira-gold/12 bg-achira-cream/65 backdrop-blur-3xl backdrop-saturate-180 md:block dark:border-white/8 dark:bg-achira-navy/65">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-achira-blue transition-opacity hover:opacity-90 dark:text-achira-cream"
        >
          <AchiraLogo className="h-9 w-9" />
          <AchiraWordmark size="md" className="items-start" />
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="liquid-glass flex w-full max-w-md items-center gap-2 rounded-full px-4 py-2.5 text-achira-blue/55 dark:text-achira-cream/55">
            <Search className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            <span className="text-xs">Хайх</span>
          </div>
        </div>
        <nav className="flex items-center gap-1 sm:gap-1.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm text-achira-blue/75 transition-colors hover:bg-white/55 hover:text-achira-blue-dark dark:text-achira-cream/75 dark:hover:bg-white/8 dark:hover:text-achira-cream sm:px-4"
            >
              {l.label}
            </Link>
          ))}
          <CartNavLink />
          <AuthNavLinks />
          <Link
            href="/profile"
            className="ios-icon-btn"
            aria-label="Профайл"
          >
            <UserRound className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
