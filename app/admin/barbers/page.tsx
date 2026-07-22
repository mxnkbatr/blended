"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  adminDeleteBarber,
  adminFetchBarbers,
  adminUpsertBarber,
  type BarberRow,
} from "@/lib/supabase/admin-crud";
import { useAdminAutoRefresh } from "@/hooks/useAdminAutoRefresh";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BarberImageUpload } from "@/components/admin/BarberImageUpload";
import { BarberScheduleEditor } from "@/components/admin/BarberScheduleEditor";
import {
  defaultBarberSchedule,
  formatWorkHours,
  normalizeBarberSchedule,
} from "@/lib/barbers/schedule";
import { DEFAULT_BOOKING_PRICE_MNT } from "@/lib/appointments/pricing";
import { hapticSuccess } from "@/lib/haptics";

type BarberForm = Omit<BarberRow, "id"> & { id?: string };

const emptyForm = (): BarberForm => ({
  name: "",
  title: "",
  image_url: null,
  bio: "",
  active: true,
  booking_price_mnt: DEFAULT_BOOKING_PRICE_MNT,
  schedule: defaultBarberSchedule(),
});

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

function scheduleSummary(row: BarberRow): string {
  const schedule = normalizeBarberSchedule(row.schedule);
  const working = Object.values(schedule).filter((d) => !d.off).length;
  if (working === 0) return "Бүх өдөр амарна";
  const sample = Object.values(schedule).find((d) => !d.off);
  return sample ? `${working} өдөр · ${formatWorkHours(sample)}` : "Хуваарь тохируулаагүй";
}

export default function AdminBarbersPage() {
  const [rows, setRows] = useState<BarberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<BarberForm | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  useAdminAutoRefresh(load);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
  }

  function openEdit(row: BarberRow) {
    setEditingId(row.id);
    setForm({
      id: row.id,
      name: row.name,
      title: row.title,
      image_url: row.image_url,
      bio: row.bio,
      active: row.active,
      booking_price_mnt: row.booking_price_mnt,
      schedule: normalizeBarberSchedule(row.schedule),
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const id = editingId ?? crypto.randomUUID();
      await adminUpsertBarber({
        id,
        name: form.name.trim(),
        title: form.title.trim(),
        image_url: form.image_url,
        bio: form.bio?.trim() || null,
        active: form.active,
        booking_price_mnt: Math.max(0, Math.floor(form.booking_price_mnt ?? 0)),
        schedule: normalizeBarberSchedule(form.schedule),
      });
      setForm(null);
      setEditingId(null);
      setSuccess("Бабер хадгалагдлаа.");
      await hapticSuccess();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалахад алдаа");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Энэ баберыг устгах уу?")) return;
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
      <AdminPageHeader
        title="Баберууд"
        description="Зураг, танилцуулга, ажлын цаг, захиалгын төлбөр."
        action={
          !form ? (
            <button type="button" onClick={openCreate} className="admin-btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Шинэ бабер
            </button>
          ) : undefined
        }
      />

      <AdminFeedback success={success} error={error} className="mt-4" />

      {form && (
        <form onSubmit={handleSave} className="mt-5 space-y-5 border-t border-achira-blue/8 pt-5 dark:border-achira-cream/8">
          <p className="text-base font-medium text-achira-blue-dark dark:text-achira-cream">
            {editingId ? "Бабер засах" : "Шинэ бабер нэмэх"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="admin-label">Нэр</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="admin-input mt-1.5"
                placeholder="Жишээ: Энхбат"
              />
            </label>
            <label className="block">
              <span className="admin-label">Цол / мэргэжил</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="admin-input mt-1.5"
                placeholder="Senior Barber"
              />
            </label>
            <label className="block">
              <span className="admin-label">Цаг захиалгын төлбөр (₮)</span>
              <input
                required
                type="number"
                min={0}
                step={1000}
                value={form.booking_price_mnt}
                onChange={(e) =>
                  setForm({
                    ...form,
                    booking_price_mnt: Number(e.target.value),
                  })
                }
                className="admin-input mt-1.5"
                placeholder="50000"
              />
              <p className="mt-1 text-xs text-achira-blue/50 dark:text-achira-cream/45">
                QPay-ээр төлөх урьдчилсан төлбөр. Бабер бүр өөр үнэтэй байж болно.
              </p>
            </label>
          </div>

          <BarberImageUpload
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
          />

          <label className="block">
            <span className="admin-label">Товч танилцуулга</span>
            <textarea
              value={form.bio ?? ""}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="admin-input mt-1.5 resize-none"
              placeholder="Туршлага, мэргэшил..."
            />
          </label>

          <BarberScheduleEditor
            value={normalizeBarberSchedule(form.schedule)}
            onChange={(schedule) => setForm({ ...form, schedule })}
          />

          <label className="flex items-center gap-2 text-sm text-achira-blue-dark dark:text-achira-cream">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Дэлгүүрт идэвхтэй харуулах
          </label>

          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={saving} className="admin-btn-primary">
              {saving ? "Хадгалж байна..." : "Хадгалах"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(null);
                setEditingId(null);
              }}
              className="admin-btn-secondary"
            >
              Болих
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="mt-6 h-28 animate-pulse rounded-2xl bg-achira-blue/5" />
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-achira-blue/55 dark:text-achira-cream/50">
          Одоогоор бабер байхгүй. «Шинэ бабер» товчоор нэмнэ үү.
        </p>
      ) : (
        <ul className={`space-y-3 ${form ? "mt-6 border-t border-achira-blue/8 pt-6 dark:border-achira-cream/8" : "mt-5"}`}>
          {rows.map((row) => (
            <li key={row.id} className="admin-list-item">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-achira-paper dark:bg-achira-blue/15">
                  {row.image_url ? (
                    <Image
                      src={row.image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-achira-blue/35 dark:text-achira-cream/35">
                      {row.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-achira-blue-dark dark:text-achira-cream">
                    {row.name}
                  </p>
                  <p className="truncate text-sm text-achira-blue/55 dark:text-achira-cream/50">
                    {row.title}
                  </p>
                  <p className="mt-0.5 text-xs text-achira-blue/45 dark:text-achira-cream/40">
                    {formatMnt(row.booking_price_mnt)} · {scheduleSummary(row)}
                    {!row.active && " · Идэвхгүй"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="rounded-xl border border-achira-blue/10 p-2.5 text-achira-blue dark:border-achira-cream/10 dark:text-achira-cream"
                  aria-label="Засах"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(row.id)}
                  className="rounded-xl border border-rose-200 p-2.5 text-rose-600 dark:border-rose-900/40 dark:text-rose-400"
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
