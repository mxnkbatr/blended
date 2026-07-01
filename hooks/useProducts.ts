"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/data/products";
import { products as fallbackProducts } from "@/lib/data/products";
import { fetchProducts } from "@/lib/supabase/queries";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const data = await fetchProducts();
      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}
