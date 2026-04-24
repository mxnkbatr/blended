import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  mode: ThemeMode;
  scheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'blended:theme:v1';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme() ?? 'light';
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const next = String(raw);
        if (next === 'light' || next === 'dark' || next === 'system') {
          if (mounted) setModeState(next);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // Хэрэглэгч сонгосон mode-г Appearance override дээр тусгана
    const nextOverride = mode === 'system' ? null : mode;
    setOverride(nextOverride);
    try {
      (Appearance as unknown as { setColorScheme?: (s: 'light' | 'dark' | null) => void })
        .setColorScheme?.(nextOverride);
    } catch {
      // ignore
    }

    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // ignore
      }
    })();
  }, [mode]);

  const scheme: 'light' | 'dark' = override ?? systemScheme;

  const setMode = (m: ThemeMode) => setModeState(m);

  const value = useMemo<ThemeContextValue>(() => {
    return { mode, scheme, setMode };
  }, [mode, scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

