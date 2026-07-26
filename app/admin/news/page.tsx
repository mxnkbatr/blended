"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  adminDeleteNewsPost,
  adminFetchNewsPosts,
  adminUpsertNewsPost,
  type NewsPostRow,
} from "@/lib/supabase/admin-crud";
import { slugifyNewsTitle } from "@/lib/supabase/news";
import { useAdminAutoRefresh } from "@/hooks/useAdminAutoRefresh";

type NewsForm = Partial<NewsPostRow> & {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
};

function emptyNews(): NewsForm {
  return {
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    cover_image_url: "",
    published: true,
  };
}

export default function AdminNewsPage() {
  const [rows, setRows] = useState<NewsPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<NewsForm | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await adminFetchNewsPosts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useAdminAutoRefresh(load);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      const slug = form.slug.trim() || slugifyNewsTitle(form.title);
      await adminUpsertNewsPost({
        ...form,
        slug,
        cover_image_url: form.cover_image_url || null,
      });
      setForm(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалахад алдаа");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Энэ мэдээг устгах уу?")) return;
    try {
      await adminDeleteNewsPost(id);
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
            Мэдээ мэдээлэл
          </h2>
          <p className="mt-1 text-sm text-achira-blue/55 dark:text-achira-cream/50">
            Апп дотор харагдах мэдээ нийтлэх / засах
          </p>
        </div>
        <button
          type="button"
          onClick={() => setForm(emptyNews())}
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
          <input
            required
            placeholder="Гарчиг"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm({
                ...form,
                title,
                slug:
                  form.id || form.slug
                    ? form.slug
                    : slugifyNewsTitle(title),
              });
            }}
            className="admin-input"
          />
          <input
            required
            placeholder="Slug (URL)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="admin-input"
          />
          <input
            placeholder="Товч тайлбар"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="admin-input"
          />
          <input
            placeholder="Нүүр зураг URL (заавал биш)"
            value={form.cover_image_url ?? ""}
            onChange={(e) =>
              setForm({ ...form, cover_image_url: e.target.value })
            }
            className="admin-input"
          />
          <textarea
            required
            rows={8}
            placeholder="Мэдээний агуулга"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="admin-input min-h-[10rem] resize-y"
          />
          <label className="flex items-center gap-2 text-sm text-achira-blue-dark dark:text-achira-cream">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({ ...form, published: e.target.checked })
              }
              className="rounded border-achira-blue/20"
            />
            Нийтлэх (published)
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary"
            >
              {saving ? "Хадгалж байна…" : "Хадгалах"}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="admin-btn-secondary"
            >
              Болих
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-achira-blue/50 dark:text-achira-cream/45">
            Ачаалж байна…
          </p>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-achira-blue/15 px-4 py-8 text-center text-sm text-achira-blue/55 dark:border-achira-cream/12 dark:text-achira-cream/50">
            Мэдээ байхгүй. «Нэмэх» дарж эхлүүлнэ үү.
          </p>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="admin-list-item">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium text-achira-blue-dark dark:text-achira-cream">
                    {row.title}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      row.published
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "bg-achira-blue/8 text-achira-blue/60 dark:bg-achira-cream/10 dark:text-achira-cream/50"
                    }`}
                  >
                    {row.published ? "Нийтлэгдсэн" : "Ноорог"}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-achira-blue/50 dark:text-achira-cream/45">
                  /news/{row.slug}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...row,
                      cover_image_url: row.cover_image_url ?? "",
                    })
                  }
                  className="rounded-xl border border-achira-blue/10 p-2 text-achira-blue/70 hover:bg-achira-blue/5 dark:border-achira-cream/10 dark:text-achira-cream/70"
                  aria-label="Засах"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(row.id)}
                  className="rounded-xl border border-rose-200/80 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/30"
                  aria-label="Устгах"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
