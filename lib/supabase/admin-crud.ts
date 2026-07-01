import { createSupabaseBrowserClient } from "./client";

export type BarberRow = {
  id: string;
  name: string;
  title: string;
  image_url: string | null;
  bio: string | null;
  active: boolean;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_mnt: number;
  image_url: string | null;
  in_stock: boolean;
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
  created_at: string;
  shop_order_items: {
    product_name: string;
    quantity: number;
    unit_price_mnt: number;
  }[];
};

function client() {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase тохиргоо хийгдээгүй.");
  return supabase;
}

export async function adminFetchBarbers(): Promise<BarberRow[]> {
  const { data, error } = await client()
    .from("barbers")
    .select("id, name, title, image_url, bio, active")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as BarberRow[];
}

export async function adminUpsertBarber(
  row: Partial<BarberRow> & { id: string; name: string; title: string },
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
    .select("id, slug, name, description, price_mnt, image_url, in_stock")
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
      "id, user_id, customer_name, customer_phone, status, total_mnt, created_at, shop_order_items(product_name, quantity, unit_price_mnt)",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminOrderRow[];
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
