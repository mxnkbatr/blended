"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiUrl } from "@/lib/api-base";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function DeleteAccountSection() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  async function handleDelete() {
    const ok = window.confirm(
      "Бүртгэлээ бүрмөсөн устгах уу? Энэ үйлдлийг буцаах боломжгүй.",
    );
    if (!ok) return;

    setBusy(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setError("Supabase тохиргоо хийгдээгүй.");
        return;
      }

      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;
      if (!accessToken) {
        setError("Сешн дууссан. Дахин нэвтэрнэ үү.");
        return;
      }

      const res = await fetch(apiUrl("/api/auth/delete-account/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ confirm: "DELETE" }),
      });

      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Бүртгэл устгахад алдаа гарлаа.");
        return;
      }

      await signOut();
      router.replace("/login/");
    } catch {
      setError("Серверт холбогдож чадсангүй.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-4 rounded-3xl border border-red-500/25 bg-red-500/[0.04] p-4 dark:border-red-400/20 dark:bg-red-500/10">
      <p className="text-sm font-semibold text-achira-blue-dark dark:text-achira-cream">
        Бүртгэл устгах
      </p>
      <p className="mt-1 text-xs leading-relaxed text-achira-blue/55 dark:text-achira-cream/50">
        Нэр, утас, профайл болон холбоотой хувийн мэдээллийг устгана. Захиалгын
        түүхээс танигдах мэдээллийг нууцлана.
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 text-sm font-medium text-red-700 underline-offset-4 hover:underline dark:text-red-300"
        >
          Бүртгэл устгах…
        </button>
      ) : (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-red-800/80 dark:text-red-200/80">
            Үргэлжлүүлбэл бүртгэл бүрмөсөн устна.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleDelete()}
              className="rounded-full bg-red-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-60 dark:bg-red-600"
            >
              {busy ? "Устгаж байна…" : "Бүрмөсөн устгах"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              className="rounded-full border border-achira-blue/20 px-4 py-2 text-xs font-medium text-achira-blue-dark dark:border-achira-cream/20 dark:text-achira-cream"
            >
              Болих
            </button>
          </div>
          {error ? (
            <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
          ) : null}
        </div>
      )}
    </section>
  );
}
