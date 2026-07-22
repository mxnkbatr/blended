"use client";

import { useVisibilityRefresh } from "@/hooks/useVisibilityRefresh";

/** Keep admin lists fresh while the dashboard is open. */
export function useAdminAutoRefresh(load: () => void | Promise<void>) {
  useVisibilityRefresh(() => {
    void load();
  }, 15_000);
}
