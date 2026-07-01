"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const redirected = useRef(false);

  useEffect(() => {
    if (loading || redirected.current) return;
    if (!user) {
      redirected.current = true;
      window.location.replace("/login/");
      return;
    }
    if (!isAdmin) {
      redirected.current = true;
      window.location.replace("/profile/");
    }
  }, [user, isAdmin, loading]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-48 animate-pulse rounded-2xl bg-achira-blue/5 dark:bg-achira-cream/5" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return <>{children}</>;
}

export function AdminAccessDenied() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-achira-blue-dark dark:text-achira-cream">
        Эрх хүрэхгүй
      </h1>
      <p className="mt-2 text-sm text-achira-blue/60 dark:text-achira-cream/55">
        Admin эрх шаардлагатай. Supabase дээр profiles.role = admin тохируулна уу.
      </p>
      <Link
        href="/profile"
        className="mt-6 inline-block text-sm text-achira-blue underline dark:text-achira-cream"
      >
        Профайл руу буцах
      </Link>
    </div>
  );
}
