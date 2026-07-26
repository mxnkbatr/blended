"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { AchiraLogo } from "./AchiraLogo";
import { AchiraWordmark } from "./AchiraWordmark";
import { AuthNavLinks } from "./AuthNavLinks";
import { CartNavLink } from "./CartNavLink";

const links = [
  { href: "/", label: "Нүүр" },
  { href: "/news", label: "Мэдээ мэдээлэл" },
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
    <header className="sticky top-0 z-50 hidden bg-gradient-to-b from-[#fbf8f2]/94 via-achira-cream/82 to-achira-cream/68 backdrop-blur-2xl md:block dark:from-achira-navy/94 dark:via-achira-navy/84 dark:to-achira-navy/70">
      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-achira-blue transition-opacity hover:opacity-90 dark:text-achira-cream"
        >
          <AchiraLogo className="h-8 w-8 transition-transform duration-300 group-hover:scale-105" />
          <AchiraWordmark size="md" className="items-start" />
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-0.5">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-4 py-2 text-[13px] tracking-wide transition-colors ${
                  active
                    ? "text-achira-blue-dark dark:text-achira-cream"
                    : "text-achira-blue/55 hover:text-achira-blue-dark dark:text-achira-cream/50 dark:hover:text-achira-cream"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="site-header-active"
                    className="absolute inset-0 rounded-full bg-gradient-to-b from-white/85 to-achira-champagne/45 shadow-[0_4px_14px_rgba(21,58,112,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-achira-gold/20 dark:from-achira-cream/12 dark:to-achira-blue/20 dark:shadow-[0_4px_14px_rgba(0,0,0,0.25)] dark:ring-white/10"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                      mass: 0.7,
                    }}
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-[1]">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <CartNavLink />
          <AuthNavLinks />
          <Link
            href="/profile"
            className="grid h-9 w-9 place-items-center rounded-full text-achira-blue/60 ring-1 ring-transparent transition-all hover:bg-white/60 hover:text-achira-blue-dark hover:ring-achira-gold/20 dark:text-achira-cream/60 dark:hover:bg-white/8 dark:hover:text-achira-cream dark:hover:ring-white/10"
            aria-label="Профайл"
          >
            <UserRound className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Gold hairline */}
      <div
        className="h-px bg-gradient-to-r from-transparent via-achira-gold/45 to-transparent dark:via-achira-gold/25"
        aria-hidden
      />
    </header>
  );
}
