"use client";

import { useCallback, useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiUrl } from "@/lib/api-base";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

async function registerTokenOnServer(
  token: string,
  platform: string,
): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return false;

  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) return false;

  const res = await fetch(apiUrl("/api/notifications/register-token/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ token, platform }),
  });

  return res.ok;
}

export function PushNotificationsInit() {
  const { user, loading } = useAuth();
  const startedRef = useRef(false);

  const registerToken = useCallback(
    async (token: string, platform: string) => {
      if (!user) return;
      await registerTokenOnServer(token, platform);
    },
    [user],
  );

  useEffect(() => {
    if (loading || !user || startedRef.current) return;
    startedRef.current = true;

    if (Capacitor.isNativePlatform()) {
      void (async () => {
        try {
          const { PushNotifications } = await import(
            "@capacitor/push-notifications"
          );

          const perm = await PushNotifications.checkPermissions();
          if (perm.receive !== "granted") {
            const req = await PushNotifications.requestPermissions();
            if (req.receive !== "granted") return;
          }

          await PushNotifications.register();

          PushNotifications.addListener("registration", async (ev) => {
            const platform = Capacitor.getPlatform();
            if (platform === "android" || platform === "ios") {
              try {
                const { FCM } = await import("@capacitor-community/fcm");
                const fcm = await FCM.getToken();
                if (fcm.token) {
                  await registerToken(fcm.token, platform);
                  return;
                }
              } catch {
                /* fallback below */
              }
            }
            if (ev.value) {
              await registerToken(ev.value, platform);
            }
          });
        } catch (err) {
          console.error("[push] native init failed:", err);
        }
      })();
      return;
    }

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator
    ) {
      void (async () => {
        try {
          if (Notification.permission === "default") {
            await Notification.requestPermission();
          }
          if (Notification.permission !== "granted") return;

          const { getWebPushToken } = await import("@/lib/firebase/client");
          const token = await getWebPushToken();
          if (token) {
            await registerToken(token, "web");
          }
        } catch (err) {
          console.error("[push] web init failed:", err);
        }
      })();
    }
  }, [loading, user, registerToken]);

  return null;
}
