import type { Barber } from "@/lib/data/barbers";
import { barbers as fallbackBarbers } from "@/lib/data/barbers";
import type { Product } from "@/lib/data/products";
import { products as fallbackProducts } from "@/lib/data/products";
import { createSupabaseBrowserClient } from "./client";

function mapBarber(row: {
  id: string;
  name: string;
  title: string;
  image_url: string | null;
}): Barber {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    imageUrl: row.image_url ?? "",
  };
}

function mapProduct(row: {
  slug: string;
  name: string;
  description: string;
  price_mnt: number;
  image_url: string | null;
}): Product {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceMnt: row.price_mnt,
    imageUrl: row.image_url ?? "",
  };
}

export async function fetchBarbers(): Promise<Barber[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return fallbackBarbers;

  const { data, error } = await supabase
    .from("barbers")
    .select("id, name, title, image_url")
    .eq("active", true)
    .order("name");

  if (error || !data?.length) {
    console.warn("[supabase] fetchBarbers:", error?.message ?? "empty, using fallback");
    return fallbackBarbers;
  }

  return data.map(mapBarber);
}

export async function fetchProducts(): Promise<Product[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return fallbackProducts;

  const { data, error } = await supabase
    .from("products")
    .select("slug, name, description, price_mnt, image_url")
    .eq("in_stock", true)
    .order("name");

  if (error || !data?.length) {
    console.warn("[supabase] fetchProducts:", error?.message ?? "empty, using fallback");
    return fallbackProducts;
  }

  return data.map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return fallbackProducts.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("slug, name, description, price_mnt, image_url")
    .eq("slug", slug)
    .eq("in_stock", true)
    .maybeSingle();

  if (error || !data) {
    return fallbackProducts.find((p) => p.slug === slug) ?? null;
  }

  return mapProduct(data);
}

export async function fetchBookedTimes(
  barberId: string,
  date: string,
): Promise<string[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const dayStart = `${date}T00:00:00+08:00`;
  const dayEnd = `${date}T23:59:59.999+08:00`;

  const { data, error } = await supabase
    .from("appointments")
    .select("starts_at, status")
    .eq("barber_id", barberId)
    .gte("starts_at", dayStart)
    .lte("starts_at", dayEnd)
    .neq("status", "CANCELLED");

  if (error || !data) {
    console.warn("[supabase] fetchBookedTimes:", error?.message);
    return [];
  }

  return data.map((row) => formatAppointmentSlot(row.starts_at));
}

function formatAppointmentSlot(iso: string): string {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ulaanbaatar",
    hour: "2-digit",
    hour12: false,
  }).format(new Date(iso));
  return `${hour}:00`;
}

function toMongoliaDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00+08:00`);
}

export type CreateAppointmentInput = {
  barberId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
};

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: "Supabase тохиргоо хийгдээгүй байна." };
  }

  const startsAt = toMongoliaDateTime(input.date, input.time);
  const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
  const id = crypto.randomUUID();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      id,
      barber_id: input.barberId,
      customer_name: input.customerName.trim(),
      customer_phone: input.customerPhone.trim(),
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "PENDING",
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data.id };
}
