"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { AchiraWordmark } from "./AchiraWordmark";

const SPLASH_MS = 900;
const FADE_MS = 320;
const FAILSAFE_MS = 2800;
const SESSION_KEY = "achira:splash:v1";

async function hideNativeSplash(fadeMs = 200) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await SplashScreen.hide({ fadeOutDuration: fadeMs });
  } catch {
    // Plugin unavailable
  }
}

export function AppSplash() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"show" | "fade" | "done">("show");

  useEffect(() => {
    setMounted(true);

    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      void hideNativeSplash(0);
      setPhase("done");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");

    // Reveal React splash under native splash (same #0d1728), then fade native away
    const reveal = window.requestAnimationFrame(() => {
      void hideNativeSplash(280);
    });

    const fadeTimer = window.setTimeout(() => setPhase("fade"), SPLASH_MS);
    const hideTimer = window.setTimeout(
      () => setPhase("done"),
      SPLASH_MS + FADE_MS,
    );
    const failsafeTimer = window.setTimeout(() => {
      void hideNativeSplash(0);
      setPhase("done");
    }, FAILSAFE_MS);

    return () => {
      window.cancelAnimationFrame(reveal);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(failsafeTimer);
    };
  }, []);

  if (!mounted || phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-achira-navy transition-opacity duration-300 ${
        phase === "fade" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={phase === "fade"}
    >
      <Image
        src="/achira-logo.png"
        alt=""
        width={180}
        height={252}
        className="h-36 w-auto object-contain"
        priority
      />
      <div className="mt-4">
        <AchiraWordmark size="lg" light />
      </div>
      <div className="mt-8 h-1 w-24 overflow-hidden rounded-full bg-achira-cream/10">
        <div className="h-full w-1/2 animate-[splash-load_1.2s_ease-in-out_infinite] rounded-full bg-achira-cream" />
      </div>
    </div>
  );
}
