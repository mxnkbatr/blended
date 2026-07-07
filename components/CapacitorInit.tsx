"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";

export function CapacitorInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    void (async () => {
      try {
        await SplashScreen.hide();
      } catch {
        // ignore
      }
    })();

    const failsafe = window.setTimeout(() => {
      void SplashScreen.hide().catch(() => undefined);
    }, 2500);

    return () => window.clearTimeout(failsafe);
  }, []);

  return null;
}
