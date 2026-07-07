"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { usePathname, useRouter } from "next/navigation";

export function CapacitorBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let remove: (() => void) | undefined;

    void (async () => {
      const { App } = await import("@capacitor/app");
      const handle = await App.addListener("backButton", () => {
        if (pathname === "/" || pathname === "/login" || pathname === "/register") {
          void App.minimizeApp();
          return;
        }
        router.back();
      });
      remove = () => void handle.remove();
    })();

    return () => remove?.();
  }, [pathname, router]);

  return null;
}
