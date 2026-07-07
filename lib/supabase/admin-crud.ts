import { createSupabaseBrowserClient } from "./client";

import type { BarberSchedule } from "@/lib/barbers/schedule";
import { DEFAULT_BOOKING_PRICE_MNT } from "@/lib/appointments/pricing";

export type BarberRow = {
  id: string;
  name: string;
  title: string;
  image_url: string | null;
  bio: string | null;
  active: boolean;
  booking_price_mnt: number;
  schedule: BarberSchedule | null;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_mnt: number;
  image_url: string | null;
  in_stock: boolean;
  always_visible: boolean;
};

export type AppointmentRow = {
  id: string;
  barber_id: string;
  customer_name: string;
  customer_phone: string;
  starts_at: string;
  ends_at: string;
  status: string;
  notes: string | null;
};

export type AdminOrderRow = {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  status: string;
  total_mnt: number;
  payment_method: string | null;
  payment_note: string | null;
  qpay_sender_invoice_no: string | null;
  created_at: string;
  shop_order_items: {
    product_name: string;
    quantity: number;
    unit_price_mnt: number;
  }[];
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
};

export type DashboardStats = {
  barbers: number;
  products: number;
  pendingAppointments: number;
  awaitingPaymentOrders: number;
  todayRevenueMnt: number;
};

function client() {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase тохиргоо хийгдээгүй.");
  return supabase;
}

export async function adminFetchBarbers(): Promise<BarberRow[]> {
  const { data, error } = await client()
    .from("barbers")
    .select("id, name, title, image_url, bio, active, booking_price_mnt, schedule")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as BarberRow[];
}

export async function adminUpsertBarber(
  row: Partial<BarberRow> & {
    id: string;
    name: string;
    title: string;
    schedule?: BarberSchedule | null;
  },
): Promise<void> {
  const { error } = await client()
    .from("barbers")
    .upsert(
      {
        id: row.id,
        name: row.name,
        title: row.title,
        image_url: row.image_url ?? null,
        bio: row.bio ?? null,
        active: row.active ?? true,
        booking_price_mnt: row.booking_price_mnt ?? DEFAULT_BOOKING_PRICE_MNT,
        schedule: row.schedule ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  if (error) throw new Error(error.message);
}

export async function adminDeleteBarber(id: string): Promise<void> {
  const { error } = await client().from("barbers").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminFetchProducts(): Promise<ProductRow[]> {
  const { data, error } = await client()
    .from("products")
    .select("id, slug, name, description, price_mnt, image_url, in_stock, always_visible")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as ProductRow[];
}

export async function adminUpsertProduct(
  row: Partial<ProductRow> & {
    slug: string;
    name: string;
    description: string;
    price_mnt: number;
  },
): Promise<void> {
  const payload = {
    slug: row.slug,
    name: row.name,
    description: row.description,
    price_mnt: row.price_mnt,
    image_url: row.image_url ?? null,
    in_stock: row.in_stock ?? true,
    always_visible: row.always_visible ?? true,
    updated_at: new Date().toISOString(),
  };

  if (row.id) {
    const { error } = await client()
      .from("products")
      .update(payload)
      .eq("id", row.id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await client()
    .from("products")
    .upsert(payload, { onConflict: "slug" });
  if (error) throw new Error(error.message);
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const { error } = await client().from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminFetchAppointments(): Promise<AppointmentRow[]> {
  const { data, error } = await client()
    .from("appointments")
    .select(
      "id, barber_id, customer_name, customer_phone, starts_at, ends_at, status, notes",
    )
    .order("starts_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as AppointmentRow[];
}

export async function adminUpdateAppointment(
  id: string,
  patch: { status?: string; notes?: string },
): Promise<void> {
  const { error } = await client()
    .from("appointments")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminDeleteAppointment(id: string): Promise<void> {
  const { error } = await client().from("appointments").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminFetchOrders(): Promise<AdminOrderRow[]> {
  const { data, error } = await client()
    .from("shop_orders")
    .select(
      "id, user_id, customer_name, customer_phone, status, total_mnt, payment_method, payment_note, qpay_sender_invoice_no, created_at, shop_order_items(product_name, quantity, unit_price_mnt)",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminOrderRow[];
}

export async function adminDeleteOrder(id: string): Promise<void> {
  const { error } = await client().from("shop_orders").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminFetchProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await client()
    .from("profiles")
    .select("id, full_name, phone, role, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as ProfileRow[];
}

export async function adminUpdateProfileRole(
  id: string,
  role: "customer" | "admin",
): Promise<void> {
  const { error } = await client()
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminFetchDashboardStats(): Promise<DashboardStats> {
  const supabase = client();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    barbersRes,
    productsRes,
    pendingRes,
    awaitingRes,
    paidTodayRes,
  ] = await Promise.all([
    supabase.from("barbers").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("status", "PENDING"),
    supabase
      .from("shop_orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "AWAITING_PAYMENT"),
    supabase
      .from("shop_orders")
      .select("total_mnt")
      .eq("status", "PAID")
      .gte("created_at", todayStart.toISOString()),
  ]);

  if (barbersRes.error) throw new Error(barbersRes.error.message);
  if (productsRes.error) throw new Error(productsRes.error.message);
  if (pendingRes.error) throw new Error(pendingRes.error.message);
  if (awaitingRes.error) throw new Error(awaitingRes.error.message);
  if (paidTodayRes.error) throw new Error(paidTodayRes.error.message);

  const todayRevenueMnt = (paidTodayRes.data ?? []).reduce(
    (sum, row) => sum + (row.total_mnt ?? 0),
    0,
  );

  return {
    barbers: barbersRes.count ?? 0,
    products: productsRes.count ?? 0,
    pendingAppointments: pendingRes.count ?? 0,
    awaitingPaymentOrders: awaitingRes.count ?? 0,
    todayRevenueMnt,
  };
}

export async function adminUpdateOrderStatus(
  id: string,
  status: string,
): Promise<void> {
  const { error } = await client()
    .from("shop_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export type PromoCodeAdminRow = {
  id: string;
  code: string;
  discount_percent: number;
  barber_ids: string[];
  product_slugs: string[];
  applies_shop: boolean;
  applies_booking: boolean;
  active: boolean;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
};

export async function adminFetchPromoCodes(): Promise<PromoCodeAdminRow[]> {
  const { data, error } = await client()
    .from("promo_codes")
    .select(
      "id, code, discount_percent, barber_ids, product_slugs, applies_shop, applies_booking, active, max_uses, used_count, expires_at",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PromoCodeAdminRow[];
}

export async function adminUpsertPromoCode(
  row: Partial<PromoCodeAdminRow> & {
    code: string;
    discount_percent: number;
  },
): Promise<void> {
  const payload = {
    code: row.code.trim().toUpperCase(),
    discount_percent: row.discount_percent,
    barber_ids: row.barber_ids ?? [],
    product_slugs: row.product_slugs ?? [],
    applies_shop: row.applies_shop ?? true,
    applies_booking: row.applies_booking ?? false,
    active: row.active ?? true,
    max_uses: row.max_uses ?? null,
    expires_at: row.expires_at ?? null,
    updated_at: new Date().toISOString(),
  };

  if (row.id) {
    const { error } = await client()
      .from("promo_codes")
      .update(payload)
      .eq("id", row.id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await client().from("promo_codes").insert(payload);
  if (error) throw new Error(error.message);
}

export async function adminDeletePromoCode(id: string): Promise<void> {
  const { error } = await client().from("promo_codes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type AdminNotificationRow = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

export async function adminFetchNotifications(): Promise<AdminNotificationRow[]> {
  const { data, error } = await client()
    .from("app_notifications")
    .select("id, title, body, created_at")
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminNotificationRow[];
}
