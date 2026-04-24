import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  slug: string;
  name: string;
  priceMnt: number;
  imageUrl: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalMnt: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'blended:cart:v1';

function sanitizeCartItem(x: any): CartItem | null {
  try {
    const slug = String(x?.slug ?? '');
    if (!slug) return null;
    const quantityRaw = Number(x?.quantity ?? 0);
    const quantity = Number.isFinite(quantityRaw) ? Math.max(0, Math.floor(quantityRaw)) : 0;
    if (quantity <= 0) return null;
    return {
      slug,
      name: String(x?.name ?? ''),
      priceMnt: Number(x?.priceMnt ?? 0),
      imageUrl: String(x?.imageUrl ?? ''),
      quantity,
    };
  } catch {
    return null;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return;
        const next = (parsed as any[]).map(sanitizeCartItem).filter(Boolean) as CartItem[];
        if (mounted) setItems(next);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }
    })();
  }, [items]);

  const addItem = useCallback(
    (input: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      const qty = Math.max(1, Math.floor(input.quantity ?? 1));
      setItems((prev) => {
        const i = prev.findIndex((l) => l.slug === input.slug);
        if (i === -1) {
          return [
            ...prev,
            {
              slug: input.slug,
              name: input.name,
              priceMnt: input.priceMnt,
              imageUrl: input.imageUrl,
              quantity: qty,
            },
          ];
        }
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + qty };
        return next;
      });
    },
    []
  );

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalMnt = items.reduce((s, l) => s + l.priceMnt * l.quantity, 0);
    const totalItems = items.reduce((s, l) => s + l.quantity, 0);
    return {
      items,
      addItem,
      removeItem,
      clearCart,
      totalItems,
      totalMnt,
    };
  }, [items, addItem, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

