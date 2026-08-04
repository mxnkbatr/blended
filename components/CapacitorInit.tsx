"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";

/** Native shell bootstrap — AppSplash owns the splash handoff. */
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
    })();

    // Failsafe if AppSplash never mounts / fails
    const failsafe = window.setTimeout(() => {
      void SplashScreen.hide({ fadeOutDuration: 200 }).catch(() => undefined);
    }, 3500);

    return () => {
      root.classList.remove("native-app");
      delete root.dataset.platform;
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
