"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export function ThemeCapacitorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !resolvedTheme) return;

    void (async () => {
      try {
        if (resolvedTheme === "dark") {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#0f1a2e" });
        } else {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: "#f4efe6" });
        }
      } catch {
        // Status bar plugin may be unavailable
      }
    })();
  }, [resolvedTheme]);

  return null;
}
