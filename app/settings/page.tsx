import { LanguageToggle } from "./language-toggle";
import { I18nText } from "./text";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";

export const metadata = {
  title: "Settings",
  description: "Тохиргоо",
};

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <p className="text-[10px] uppercase tracking-[0.32em] text-achira-cream/50">
        <I18nText k="settings" />
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] text-achira-cream">
        <I18nText k="settings" />
      </h1>

      <section className="mt-8 rounded-3xl border border-achira-cream/10 bg-achira-blue/10 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-achira-cream">
              <I18nText k="language" />
            </p>
            <p className="mt-1 text-xs text-achira-cream/50">
              <I18nText k="languageHelp" />
            </p>
          </div>
          <LanguageToggle />
        </div>
      </section>

      <DeleteAccountSection />
    </main>
  );
}
