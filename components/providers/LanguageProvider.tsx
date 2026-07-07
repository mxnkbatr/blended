"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "mn" | "en";

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict.mn) => string;
};

const dict = {
  mn: {
    settings: "Тохиргоо",
    theme: "Theme",
    themeHelp: "Light / Dark горимоо сонгоно.",
    language: "Хэл",
    languageHelp: "Монгол / English сонгоно.",
    light: "Light",
    dark: "Dark",
    wishlist: "Хадгалсан",
    notifications: "Мэдэгдэл",
    shop: "Дэлгүүр",
    bestSeller: "Тун удахгүй",
    searchPlaceholder: "Хайх…",
  },
  en: {
    settings: "Settings",
    theme: "Theme",
    themeHelp: "Choose Light / Dark mode.",
    language: "Language",
    languageHelp: "Choose Mongolian / English.",
    light: "Light",
    dark: "Dark",
    wishlist: "Wishlist",
    notifications: "Notifications",
    shop: "Shop",
    bestSeller: "Coming soon",
    searchPlaceholder: "Search…",
  },
} as const;

const STORAGE_KEY = "blended:lang:v1";

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("mn");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "mn" || raw === "en") setLangState(raw);
    } catch {
      // ignore
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: keyof typeof dict.mn) => {
      return dict[lang][key] ?? dict.mn[key];
    },
    [lang],
  );

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [
    lang,
    setLang,
    t,
  ]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

