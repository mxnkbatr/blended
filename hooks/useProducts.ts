"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/lib/data/products";
import { fetchProducts } from "@/lib/supabase/queries";
import { useVisibilityRefresh } from "@/hooks/useVisibilityRefresh";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
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

  return { products, loading, refetch: () => load(true) };
}
