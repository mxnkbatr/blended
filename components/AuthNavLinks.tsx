"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { LogIn, Shield } from "lucide-react";

export function AuthNavLinks() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-10 w-20 animate-pulse rounded-full bg-achira-blue/5 dark:bg-achira-cream/5" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/login"
          className="hidden rounded-full px-3 py-2 text-sm text-achira-blue/80 transition-colors hover:bg-achira-blue/8 hover:text-achira-blue-dark dark:text-achira-cream/80 dark:hover:bg-achira-cream/8 dark:hover:text-achira-cream sm:inline-flex"
        >
          Нэвтрэх
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 rounded-full bg-achira-blue px-3 py-2 text-sm font-medium text-achira-cream transition-colors hover:bg-achira-blue-dark dark:bg-achira-cream dark:text-achira-blue-dark dark:hover:bg-achira-paper sm:px-4"
        >
          <LogIn className="h-3.5 w-3.5" strokeWidth={1.5} />
          Бүртгүүлэх
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-full border border-achira-burgundy/20 bg-achira-burgundy/10 px-3 py-2 text-sm text-achira-burgundy transition-colors hover:bg-achira-burgundy/15 dark:border-achira-cream/15 dark:bg-achira-cream/10 dark:text-achira-cream sm:px-4"
        >
          <Shield className="h-3.5 w-3.5" strokeWidth={1.5} />
          Admin
        </Link>
      )}
    </div>
  );
}
