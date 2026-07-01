"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

export function CapacitorInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    void (async () => {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: "#f4efe6" });
      } catch {
        // Status bar plugin may be unavailable
      }

      // Native splash хэзээ ч гацахгүй — шууд + failsafe
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
