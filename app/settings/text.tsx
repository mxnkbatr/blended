"use client";

import { useI18n } from "@/components/providers/LanguageProvider";

export function I18nText({ k }: { k: Parameters<ReturnType<typeof useI18n>["t"]>[0] }) {
  const { t } = useI18n();
  return <>{t(k)}</>;
}

