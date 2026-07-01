"use client";

import { useEffect, useState } from "react";
import type { Barber } from "@/lib/data/barbers";
import { barbers as fallbackBarbers } from "@/lib/data/barbers";
import { fetchBarbers } from "@/lib/supabase/queries";

export function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>(fallbackBarbers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const data = await fetchBarbers();
      if (!cancelled) {
        setBarbers(data);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { barbers, loading };
}
