"use client";

import { useEffect } from "react";

/** Refetch when the tab gains focus or on a fixed interval (admin/catalog freshness). */
export function useVisibilityRefresh(
  onRefresh: () => void,
  intervalMs = 30_000,
) {
  useEffect(() => {
    const refresh = () => onRefresh();

    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", refresh);
    const id = window.setInterval(refresh, intervalMs);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", refresh);
      window.clearInterval(id);
    };
  }, [onRefresh, intervalMs]);
}
