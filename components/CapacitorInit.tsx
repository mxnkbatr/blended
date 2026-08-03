"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";

export function CapacitorInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const root = document.documentElement;
    root.classList.add("native-app");
    root.dataset.platform = Capacitor.getPlatform();

    void (async () => {
      try {
        const { StatusBar } = await import("@capacitor/status-bar");
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch {
        // Status bar overlay may be unavailable
      }

      try {
        await SplashScreen.hide();
      } catch {
        // ignore
      }
    })();

    const failsafe = window.setTimeout(() => {
      void SplashScreen.hide().catch(() => undefined);
    }, 2500);

    return () => {
      root.classList.remove("native-app");
      delete root.dataset.platform;
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
