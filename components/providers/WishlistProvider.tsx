"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type WishlistItem = {
  slug: string;
  name: string;
  priceMnt: number;
  imageUrl: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  has: (slug: string) => boolean;
  add: (item: WishlistItem) => void;
  remove: (slug: string) => void;
  toggle: (item: WishlistItem) => void;
  clear: () => void;
  count: number;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "blended:wishlist:v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      setItems(
        parsed.filter(Boolean).map((x: any) => ({
          slug: String(x.slug ?? ""),
          name: String(x.name ?? ""),
          priceMnt: Number(x.priceMnt ?? 0),
          imageUrl: String(x.imageUrl ?? ""),
        })),
      );
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [
    items,
  ]);

  const add = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.slug === item.slug)) return prev;
      return [item, ...prev];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.slug === item.slug)) {
        return prev.filter((p) => p.slug !== item.slug);
      }
      return [item, ...prev];
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(() => {
    return {
      items,
      has,
      add,
      remove,
      toggle,
      clear,
      count: items.length,
    };
  }, [items, has, add, remove, toggle, clear]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

