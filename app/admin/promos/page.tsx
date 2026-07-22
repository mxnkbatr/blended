"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  adminDeletePromoCode,
  adminFetchBarbers,
  adminFetchProducts,
  adminFetchPromoCodes,
  adminUpsertPromoCode,
  type BarberRow,
  type ProductRow,
  type PromoCodeAdminRow,
} from "@/lib/supabase/admin-crud";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminAutoRefresh } from "@/hooks/useAdminAutoRefresh";
import { hapticSuccess } from "@/lib/haptics";

type PromoForm = Omit<PromoCodeAdminRow, "id" | "used_count"> & { id?: string };

const emptyForm = (): PromoForm => ({
  code: "",
  discount_percent: 10,
  barber_ids: [],
  product_slugs: [],
  applies_shop: true,
  applies_booking: false,
  active: true,
  max_uses: null,
  expires_at: null,
});

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function AdminPromosPage() {
  const [rows, setRows] = useState<PromoCodeAdminRow[]>([]);
  const [barbers, setBarbers] = useState<BarberRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<PromoForm | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [promos, barberRows, productRows] = await Promise.all([
        adminFetchPromoCodes(),
        adminFetchBarbers(),
        adminFetchProducts(),
      ]);
      setRows(promos);
      setBarbers(barberRows);
      setProducts(productRows);
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
    setSuccess(null);
    try {
      await adminUpsertPromoCode(form);
      setForm(null);
      setSuccess("Промо код хадгалагдлаа.");
      await hapticSuccess();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалахад алдаа");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Промо кодыг устгах уу?")) return;
    setSuccess(null);
    try {
      await adminDeletePromoCode(id);
      setSuccess("Устгагдлаа.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Промо код"
        description="Код үүсгэж, бабер/бараа сонгож, хөнгөлөлтийн хувь тохируулна."
        action={
          !form ? (
            <button
              type="button"
              onClick={() => setForm(emptyForm())}
              className="admin-btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Шинэ код
            </button>
          ) : undefined
        }
      />

      <AdminFeedback success={success} error={error} className="mt-4" />

      {form && (
        <form
          onSubmit={handleSave}
          className="mt-5 space-y-4 border-t border-achira-blue/8 pt-5 dark:border-achira-cream/8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="admin-label">Промо код</span>
              <input
                required
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                className="admin-input mt-1.5 uppercase"
                placeholder="Кодоо оруулна уу"
              />
            </label>
            <label className="block">
              <span className="admin-label">Хөнгөлөлт (%)</span>
              <input
                required
                type="number"
                min={1}
                max={100}
                value={form.discount_percent}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discount_percent: Number(e.target.value),
                  })
                }
                className="admin-input mt-1.5"
              />
            </label>
            <label className="block">
              <span className="admin-label">Хэрэглэх хязгаар</span>
              <input
                type="number"
                min={1}
                value={form.max_uses ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    max_uses: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="admin-input mt-1.5"
                placeholder="Хязгааргүй"
              />
            </label>
            <label className="block">
              <span className="admin-label">Дуусах огноо</span>
              <input
                type="datetime-local"
                value={
                  form.expires_at
                    ? new Date(form.expires_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    expires_at: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
                className="admin-input mt-1.5"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.applies_shop}
                onChange={(e) =>
                  setForm({ ...form, applies_shop: e.target.checked })
                }
              />
              Дэлгүүрийн бараа
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.applies_booking}
                onChange={(e) =>
                  setForm({ ...form, applies_booking: e.target.checked })
                }
              />
              Цаг захиалга
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Идэвхтэй
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-achira-blue/8 p-3 dark:border-achira-cream/8">
              <p className="admin-label">Бабер (хоосон = бүгд)</p>
              <div className="mt-2 max-h-40 space-y-2 overflow-y-auto text-sm">
                {barbers.map((barber) => (
                  <label key={barber.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.barber_ids.includes(barber.id)}
                      onChange={() =>
                        setForm({
                          ...form,
                          barber_ids: toggleValue(form.barber_ids, barber.id),
                        })
                      }
                    />
                    {barber.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-achira-blue/8 p-3 dark:border-achira-cream/8">
              <p className="admin-label">Бараа (хоосон = бүгд)</p>
              <div className="mt-2 max-h-40 space-y-2 overflow-y-auto text-sm">
                {products.map((product) => (
                  <label key={product.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.product_slugs.includes(product.slug)}
                      onChange={() =>
                        setForm({
                          ...form,
                          product_slugs: toggleValue(
                            form.product_slugs,
                            product.slug,
                          ),
                        })
                      }
                    />
                    {product.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="admin-btn-primary">
              {saving ? "Хадгалж байна..." : "Хадгалах"}
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

      {loading ? (
        <div className="mt-6 h-28 animate-pulse rounded-2xl bg-achira-blue/5" />
      ) : (
        <ul className={`space-y-3 ${form ? "mt-6 border-t pt-6" : "mt-5"}`}>
          {rows.map((row) => (
            <li key={row.id} className="admin-list-item">
              <div>
                <p className="font-medium text-achira-blue-dark dark:text-achira-cream">
                  {row.code}{" "}
                  <span className="text-sm text-achira-burgundy dark:text-achira-gold">
                    -{row.discount_percent}%
                  </span>
                </p>
                <p className="text-sm text-achira-blue/55 dark:text-achira-cream/50">
                  {row.applies_shop && "Дэлгүүр"}
                  {row.applies_shop && row.applies_booking && " · "}
                  {row.applies_booking && "Цаг"}
                  {" · "}
                  {row.used_count}
                  {row.max_uses ? `/${row.max_uses}` : ""} удаа
                  {!row.active && " · Идэвхгүй"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm(row)}
                  className="rounded-xl border border-achira-blue/10 p-2.5"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(row.id)}
                  className="rounded-xl border border-rose-200 p-2.5 text-rose-600"
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
