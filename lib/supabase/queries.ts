import type { Barber } from "@/lib/data/barbers";
import { barbers as fallbackBarbers } from "@/lib/data/barbers";
import type { Product } from "@/lib/data/products";
import { products as fallbackProducts } from "@/lib/data/products";
import {
  normalizeBarberSchedule,
} from "@/lib/barbers/schedule";
import { resolveBookingPriceMnt } from "@/lib/appointments/pricing";
import { createSupabaseBrowserClient } from "./client";

const PRODUCT_SELECT =
  "slug, name, description, price_mnt, image_url, in_stock, always_visible";

function mapBarber(row: {
  id: string;
  name: string;
  title: string;
  image_url: string | null;
  booking_price_mnt?: number | null;
  schedule?: unknown;
}): Barber {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    imageUrl: row.image_url ?? "",
    bookingPriceMnt: resolveBookingPriceMnt(row.booking_price_mnt),
    schedule: normalizeBarberSchedule(row.schedule),
  };
}

function mapProduct(row: {
  slug: string;
  name: string;
  description: string;
  price_mnt: number;
  image_url: string | null;
  in_stock?: boolean;
  always_visible?: boolean;
}): Product {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceMnt: row.price_mnt,
    imageUrl: row.image_url ?? "",
    inStock: row.in_stock ?? true,
    alwaysVisible: row.always_visible ?? true,
  };
}

function withFallbackDefaults(product: Product): Product {
  return {
    ...product,
    inStock: product.inStock ?? true,
    alwaysVisible: product.alwaysVisible ?? true,
  };
}

export async function fetchBarbers(): Promise<Barber[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return fallbackBarbers;

  const { data, error } = await supabase
    .from("barbers")
    .select("id, name, title, image_url, booking_price_mnt, schedule")
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
  if (!supabase) {
    return fallbackProducts.map(withFallbackDefaults);
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .or("in_stock.eq.true,always_visible.eq.true")
    .order("name");

  if (error) {
    console.warn("[supabase] fetchProducts:", error.message);
    return fallbackProducts.map(withFallbackDefaults);
  }

  if (!data?.length) {
    return fallbackProducts.map(withFallbackDefaults);
  }

  return data.map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    const product = fallbackProducts.find((p) => p.slug === slug);
    return product ? withFallbackDefaults(product) : null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .or("in_stock.eq.true,always_visible.eq.true")
    .maybeSingle();

  if (error) {
    console.warn("[supabase] fetchProductBySlug:", error.message);
  }

  if (data) {
    return mapProduct(data);
  }

  const fallback = fallbackProducts.find((p) => p.slug === slug);
  return fallback ? withFallbackDefaults(fallback) : null;
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
  const now = new Date().toISOString();

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
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data.id };
}
