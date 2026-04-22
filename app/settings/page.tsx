import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { I18nText } from "./text";

export const metadata = {
  title: "Settings",
  description: "Тохиргоо",
};

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-600 dark:text-zinc-600">
        <I18nText k="settings" />
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] text-zinc-950 dark:text-white">
        <I18nText k="settings" />
      </h1>

      <section className="mt-8 rounded-3xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">
              <I18nText k="theme" />
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              <I18nText k="themeHelp" />
            </p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">
              <I18nText k="language" />
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              <I18nText k="languageHelp" />
            </p>
          </div>
          <LanguageToggle />
        </div>
      </section>
    </main>
  );
}

