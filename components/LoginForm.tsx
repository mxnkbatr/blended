"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { validateMongoliaPhone } from "@/lib/auth/phone";
import { hapticLight } from "@/lib/haptics";

type Mode = "signin" | "signup";

type LoginFormProps = {
  defaultMode?: Mode;
};

export function LoginForm({ defaultMode = "signin" }: LoginFormProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const phoneError = validateMongoliaPhone(phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    setSubmitting(true);
    await hapticLight();

    if (mode === "signup") {
      const result = await signUp(phone.trim(), password, name.trim());
      setSubmitting(false);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (!result.sessionCreated) {
        setInfo("Бүртгэл амжилттай. Нэвтэрнэ үү.");
        setMode("signin");
      }
      return;
    }

    const result = await signIn(phone.trim(), password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    }
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-center px-4 py-10 md:max-w-lg">
      <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-achira-blue/55 dark:text-achira-cream/50">
        Achira Artist
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-achira-blue-dark dark:text-achira-cream md:text-4xl">
        {mode === "signin" ? "Нэвтрэх" : "Бүртгүүлэх"}
      </h1>
      <p className="mt-2 text-sm text-achira-blue/65 dark:text-achira-cream/60">
        {mode === "signin"
          ? "Утасны дугаар, нууц үгээ оруулна уу."
          : "Утас, нууц үгээ оруулаад бүртгүүлнэ."}
      </p>

      <div className="mt-6 flex rounded-2xl border border-achira-blue/12 bg-achira-paper/50 p-1 dark:border-achira-cream/10 dark:bg-achira-blue/10">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setInfo(null);
            }}
            className={`flex-1 rounded-xl py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
              mode === m
                ? "bg-achira-blue text-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                : "text-achira-blue/60 dark:text-achira-cream/55"
            }`}
          >
            {m === "signin" ? "Нэвтрэх" : "Бүртгэл"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <div>
            <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50">
              Нэр
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-achira-blue/12 bg-white/80 px-4 py-3.5 text-base text-achira-ink outline-none focus:border-achira-blue/30 dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
              placeholder="Таны нэр"
              autoComplete="name"
            />
          </div>
        )}
        <div>
          <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50">
            Утасны дугаар
          </label>
          <div className="mt-1.5 flex gap-2">
            <div className="flex min-w-0 flex-1 overflow-hidden rounded-2xl border border-achira-blue/12 bg-white/80 focus-within:border-achira-blue/30 dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:focus-within:border-achira-cream/30">
              <span className="flex items-center border-r border-achira-blue/10 px-3 text-sm text-achira-blue/55 dark:border-achira-cream/10 dark:text-achira-cream/50">
                +976
              </span>
              <input
                required
                type="tel"
                inputMode="numeric"
                maxLength={11}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/[^\d]/g, ""));
                }}
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base text-achira-ink outline-none dark:text-achira-cream"
                placeholder="99112233"
                autoComplete="tel"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-achira-blue/55 dark:text-achira-cream/50">
            Нууц үг
          </label>
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-achira-blue/12 bg-white/80 px-4 py-3.5 text-base text-achira-ink outline-none focus:border-achira-blue/30 dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
            placeholder="••••••••"
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
          />
          <p className="mt-1.5 text-[11px] text-achira-blue/45 dark:text-achira-cream/40">
            Хамгийн багадаа 6 тэмдэгт
          </p>
        </div>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-xl border border-achira-blue/15 bg-achira-blue/5 px-3 py-2 text-sm text-achira-blue dark:border-achira-cream/15 dark:bg-achira-cream/5 dark:text-achira-cream">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-achira-blue py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-achira-cream transition-transform active:scale-[0.98] disabled:opacity-60 dark:bg-achira-cream dark:text-achira-blue-dark"
        >
          {submitting
            ? "Түр хүлээнэ үү..."
            : mode === "signin"
              ? "Нэвтрэх"
              : "Бүртгүүлэх"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-achira-blue/60 dark:text-achira-cream/55">
        {mode === "signin" ? (
          <>
            Бүртгэл байхгүй юу?{" "}
            <Link
              href="/register"
              className="font-medium text-achira-blue underline-offset-4 hover:underline dark:text-achira-cream"
            >
              Бүртгүүлэх
            </Link>
          </>
        ) : (
          <>
            Аль хэдийн бүртгэлтэй юу?{" "}
            <Link
              href="/login"
              className="font-medium text-achira-blue underline-offset-4 hover:underline dark:text-achira-cream"
            >
              Нэвтрэх
            </Link>
          </>
        )}
      </p>
    </main>
  );
}
