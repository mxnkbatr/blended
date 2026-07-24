"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { LoginForm } from "@/components/LoginForm";

const PUBLIC_PATHS = ["/login", "/register", "/privacy", "/terms", "/delete-account"] as const;

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isPublic = isPublicPath(pathname);
  const sentHome = useRef(false);

  // Нэвтэрсэн хэрэглэгч login/register дээр байвал нүүр рүү (router биш — loop үгүй)
  useEffect(() => {
    if (loading || !user || !isPublic || sentHome.current) return;
    sentHome.current = true;
    window.location.replace("/");
  }, [user, loading, isPublic]);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-achira-cream dark:bg-achira-navy">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-achira-blue/20 border-t-achira-blue dark:border-achira-cream/20 dark:border-t-achira-cream" />
      </div>
    );
  }

  // Нэвтрээгүй — хамгаалагдсан хуудсууд дээр login form (redirect хийхгүй)
  if (!user && !isPublic) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
