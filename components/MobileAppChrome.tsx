"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";

const MINIMAL_CHROME = ["/login", "/register", "/checkout", "/admin"];

export function MobileAppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = MINIMAL_CHROME.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  return (
    <div
      className={`flex min-h-[calc(100dvh-3rem)] flex-col md:min-h-[calc(100dvh-4rem)] ${
        minimal ? "pb-0" : "pb-[10rem] md:pb-0"
      }`}
    >
      {children}
      {!minimal && <SiteFooter />}
    </div>
  );
}
