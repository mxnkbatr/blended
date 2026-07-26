"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { LogIn, Shield } from "lucide-react";

export function AuthNavLinks() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-9 w-20 animate-pulse rounded-full bg-achira-blue/5 dark:bg-achira-cream/5" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1 sm:gap-1.5">
        <Link
          href="/login"
          className="hidden px-3 py-2 text-[13px] tracking-wide text-achira-blue/55 transition-colors hover:text-achira-blue-dark dark:text-achira-cream/50 dark:hover:text-achira-cream sm:inline-flex"
        >
          Нэвтрэх
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-achira-blue-light to-achira-blue px-4 py-2 text-[13px] font-medium text-achira-cream shadow-[0_6px_18px_rgba(28,74,140,0.22),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:shadow-[0_8px_22px_rgba(28,74,140,0.3)] active:scale-[0.97] dark:from-achira-cream dark:to-achira-champagne dark:text-achira-blue-dark dark:shadow-[0_6px_18px_rgba(0,0,0,0.3)]"
        >
          <LogIn className="h-3.5 w-3.5" strokeWidth={1.5} />
          Бүртгүүлэх
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-full border border-achira-burgundy/20 bg-gradient-to-b from-white/70 to-achira-burgundy/8 px-3.5 py-2 text-[13px] text-achira-burgundy shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors hover:bg-achira-burgundy/10 dark:border-achira-cream/15 dark:from-achira-cream/10 dark:to-achira-navy/40 dark:text-achira-cream dark:shadow-none"
        >
          <Shield className="h-3.5 w-3.5" strokeWidth={1.5} />
          Admin
        </Link>
      )}
    </div>
  );
}
