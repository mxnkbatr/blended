"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

/** Always dark — light mode removed */
export function ThemeCapacitorSync() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    void (async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#0d1728" });
      } catch {
        // Status bar plugin may be unavailable
      }
    })();
  }, []);

  return null;
}
