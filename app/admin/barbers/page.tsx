"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  adminDeleteBarber,
  adminFetchBarbers,
  adminUpsertBarber,
  type BarberRow,
} from "@/lib/supabase/admin-crud";

const emptyForm = (): BarberRow => ({
  id: "",
  name: "",
  title: "",
  image_url: "",
  bio: "",
  active: true,
});

export default function AdminBarbersPage() {
  const [rows, setRows] = useState<BarberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BarberRow | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await adminFetchBarbers());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      const id = form.id.trim() || `b${Date.now()}`;
      await adminUpsertBarber({ ...form, id });
      setForm(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалахад алдаа");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Устгах уу?")) return;
    setError(null);
    try {
      await adminDeleteBarber(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Устгахад алдаа");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-achira-blue-dark dark:text-achira-cream">
            Баберууд
          </h2>
          <p className="mt-1 text-sm text-achira-blue/55 dark:text-achira-cream/50">
            {rows.length} бүртгэлтэй
          </p>
        </div>
        <button
          type="button"
          onClick={() => setForm(emptyForm())}
          className="inline-flex items-center gap-2 rounded-xl bg-achira-blue px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
        >
          <Plus className="h-4 w-4" />
          Нэмэх
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </p>
      )}

      {form && (
        <form
          onSubmit={handleSave}
          className="mt-6 space-y-3 rounded-2xl border border-achira-blue/12 bg-achira-paper/60 p-4 dark:border-achira-cream/10 dark:bg-achira-blue/10"
        >
          <p className="text-sm font-medium text-achira-blue-dark dark:text-achira-cream">
            {form.id ? "Засах" : "Шинэ бабер"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="ID (жишээ: b4)"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="admin-input"
              disabled={rows.some((r) => r.id === form.id && form.id !== "")}
            />
            <input
              required
              placeholder="Нэр"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input"
            />
            <input
              required
              placeholder="Цол"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
            />
            <input
              placeholder="Зураг URL"
              value={form.image_url ?? ""}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="admin-input sm:col-span-2"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-achira-blue-dark dark:text-achira-cream">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Идэвхтэй
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="admin-btn-primary">
              {saving ? "Хадгалж..." : "Хадгалах"}
            </button>
            <button type="button" onClick={() => setForm(null)} className="admin-btn-secondary">
              Болих
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-achira-blue/5" />
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-achira-blue/10 bg-white/60 px-4 py-3 dark:border-achira-cream/10 dark:bg-achira-navy/40"
            >
              <div>
                <p className="font-medium text-achira-blue-dark dark:text-achira-cream">
                  {row.name}{" "}
                  <span className="text-xs text-achira-blue/50">({row.id})</span>
                </p>
                <p className="text-sm text-achira-blue/60 dark:text-achira-cream/55">
                  {row.title}
                  {!row.active && " · Идэвхгүй"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm(row)}
                  className="rounded-lg border border-achira-blue/12 p-2 text-achira-blue dark:border-achira-cream/12 dark:text-achira-cream"
                  aria-label="Засах"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(row.id)}
                  className="rounded-lg border border-rose-200 p-2 text-rose-600 dark:border-rose-900/40 dark:text-rose-400"
                  aria-label="Устгах"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
