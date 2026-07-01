"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  slug: string;
  name: string;
  priceMnt: number;
  imageUrl: string;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (input: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setQty: (slug: string, qty: number) => void;
  removeLine: (slug: string) => void;
  clear: () => void;
  totalMnt: number;
  count: number;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "achira:cart:v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setLines(
            parsed
              .filter(Boolean)
              .map((x: Record<string, unknown>) => ({
                slug: String(x.slug ?? ""),
                name: String(x.name ?? ""),
                priceMnt: Number(x.priceMnt ?? 0),
                imageUrl: String(x.imageUrl ?? ""),
                qty: Math.max(1, Number(x.qty ?? 1)),
              }))
              .filter((l) => l.slug && l.name),
          );
        }
      }
    } catch {
      // ignore corrupt cart
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback(
    (input: Omit<CartLine, "qty"> & { qty?: number }) => {
      const qty = input.qty ?? 1;
      setLines((prev) => {
        const i = prev.findIndex((l) => l.slug === input.slug);
        if (i === -1) {
          return [
            ...prev,
            {
              slug: input.slug,
              name: input.name,
              priceMnt: input.priceMnt,
              imageUrl: input.imageUrl,
              qty,
            },
          ];
        }
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      });
    },
    [],
  );

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => l.slug !== slug);
      return prev.map((l) => (l.slug === slug ? { ...l, qty } : l));
    });
  }, []);

  const removeLine = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalMnt = lines.reduce((s, l) => s + l.priceMnt * l.qty, 0);
    const count = lines.reduce((s, l) => s + l.qty, 0);
    return {
      lines,
      addItem,
      setQty,
      removeLine,
      clear,
      totalMnt,
      count,
      hydrated,
    };
  }, [lines, addItem, setQty, removeLine, clear, hydrated]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
