import { createSupabaseBrowserClient } from "./client";
import type { CartLine } from "@/components/providers/CartProvider";

export type ShopOrder = {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  total_mnt: number;
  payment_method: string | null;
  created_at: string;
  shop_order_items: {
    product_name: string;
    quantity: number;
    unit_price_mnt: number;
    product_slug: string;
  }[];
};

export type CreateShopOrderInput = {
  lines: CartLine[];
  customerName: string;
  customerPhone: string;
  paymentMethod: "qpay" | "socialpay";
  userId?: string | null;
};

export async function createShopOrder(
  input: CreateShopOrderInput,
): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: "Supabase тохиргоо хийгдээгүй." };
  }

  const totalMnt = input.lines.reduce(
    (s, l) => s + l.priceMnt * l.qty,
    0,
  );

  const { data: order, error: orderError } = await supabase
    .from("shop_orders")
    .insert({
      user_id: input.userId ?? null,
      customer_name: input.customerName.trim(),
      customer_phone: input.customerPhone.trim(),
      status: "AWAITING_PAYMENT",
      total_mnt: totalMnt,
      payment_method: input.paymentMethod,
      payment_note: `ACHIRA-${Date.now().toString(36).toUpperCase()}`,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, error: orderError?.message ?? "Захиалга үүсгэж чадсангүй." };
  }

  const items = input.lines.map((line) => ({
    order_id: order.id,
    product_slug: line.slug,
    product_name: line.name,
    quantity: line.qty,
    unit_price_mnt: line.priceMnt,
    image_url: line.imageUrl,
  }));

  const { error: itemsError } = await supabase
    .from("shop_order_items")
    .insert(items);

  if (itemsError) {
    return { ok: false, error: itemsError.message };
  }

  return { ok: true, orderId: order.id };
}

export async function fetchUserOrders(
  userId: string,
): Promise<ShopOrder[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("shop_orders")
    .select(
      "id, customer_name, customer_phone, status, total_mnt, payment_method, created_at, shop_order_items(product_name, quantity, unit_price_mnt, product_slug)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) {
    console.warn("[supabase] fetchUserOrders:", error?.message);
    return [];
  }

  return data as ShopOrder[];
}
