"use client";

import { useCallback, useEffect, useState } from "react";
import type { Barber } from "@/lib/data/barbers";
import { fetchBarbers } from "@/lib/supabase/queries";
import { useVisibilityRefresh } from "@/hooks/useVisibilityRefresh";

export function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await fetchBarbers();
      setBarbers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useVisibilityRefresh(() => {
    void load(true);
  });

  return { barbers, loading, refetch: () => load(true) };
}
