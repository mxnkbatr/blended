import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CartLine } from "@/components/providers/CartProvider";

export type CheckoutLine = {
  slug: string;
  name: string;
  priceMnt: number;
  qty: number;
  imageUrl: string;
};

export async function createShopOrderServer(input: {
  lines: CheckoutLine[];
  customerName: string;
  customerPhone: string;
  paymentMethod: "qpay" | "socialpay";
  userId?: string | null;
  qpayInvoiceId?: string | null;
  qpaySenderInvoiceNo?: string | null;
}): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  const supabase = createSupabaseAdminClient();

  const totalMnt = input.lines.reduce(
    (sum, line) => sum + line.priceMnt * line.qty,
    0,
  );

  const paymentNote =
    input.qpaySenderInvoiceNo ??
    `ACHIRA-${Date.now().toString(36).toUpperCase()}`;

  const { data: order, error: orderError } = await supabase
    .from("shop_orders")
    .insert({
      user_id: input.userId ?? null,
      customer_name: input.customerName.trim(),
      customer_phone: input.customerPhone.trim(),
      status: "AWAITING_PAYMENT",
      total_mnt: totalMnt,
      payment_method: input.paymentMethod,
      payment_note: paymentNote,
      qpay_invoice_id: input.qpayInvoiceId ?? null,
      qpay_sender_invoice_no: input.qpaySenderInvoiceNo ?? null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return {
      ok: false,
      error: orderError?.message ?? "Захиалга үүсгэж чадсангүй.",
    };
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

export async function markOrderPaidByQPayInvoice(
  invoiceId: string,
): Promise<{ ok: boolean; orderId?: string }> {
  const supabase = createSupabaseAdminClient();

  const { data: order, error: findError } = await supabase
    .from("shop_orders")
    .select("id, status, total_mnt")
    .eq("qpay_invoice_id", invoiceId)
    .maybeSingle();

  if (findError || !order) {
    return { ok: false };
  }

  if (order.status === "PAID") {
    return { ok: true, orderId: order.id };
  }

  const { error: updateError } = await supabase
    .from("shop_orders")
    .update({
      status: "PAID",
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (updateError) {
    return { ok: false };
  }

  return { ok: true, orderId: order.id };
}

export async function getOrderPaymentState(orderId: string) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("shop_orders")
    .select("id, status, qpay_invoice_id, total_mnt, payment_note")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export function toCheckoutLines(lines: CartLine[]): CheckoutLine[] {
  return lines.map((line) => ({
    slug: line.slug,
    name: line.name,
    priceMnt: line.priceMnt,
    qty: line.qty,
    imageUrl: line.imageUrl,
  }));
}
