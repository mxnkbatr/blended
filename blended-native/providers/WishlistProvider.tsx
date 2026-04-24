import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type WishlistContextValue = {
  slugs: ReadonlySet<string>;
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  count: number;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = 'blended:wishlist:v1';

function sanitizeSlug(x: any): string | null {
  const s = String(x ?? '').trim();
  return s ? s : null;
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slugs, setSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return;
        const next = new Set((parsed as any[]).map(sanitizeSlug).filter(Boolean) as string[]);
        if (mounted) setSlugs(next);
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
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(slugs)));
      } catch {
        // ignore
      }
    })();
  }, [slugs]);

  const has = useCallback((slug: string) => slugs.has(slug), [slugs]);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const value = useMemo<WishlistContextValue>(() => {
    return {
      slugs,
      toggle,
      has,
      count: slugs.size,
    };
  }, [slugs, toggle, has]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

