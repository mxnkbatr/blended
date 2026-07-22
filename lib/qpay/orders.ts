import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CartLine } from "@/components/providers/CartProvider";
import { incrementPromoUsage } from "@/lib/promo/server";
import {
  buildOrderPaidSms,
  sendOrderPaidSms,
} from "@/lib/twilio/sms";

type OrderRow = {
  id: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  total_mnt: number;
  payment_note: string | null;
  qpay_sender_invoice_no: string | null;
  payment_sms_sent_at: string | null;
  promo_id: string | null;
};

async function fetchOrderByInvoice(invoiceId: string): Promise<OrderRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("shop_orders")
    .select(
      "id, status, customer_name, customer_phone, total_mnt, payment_note, qpay_sender_invoice_no, payment_sms_sent_at, promo_id",
    )
    .eq("qpay_invoice_id", invoiceId)
    .maybeSingle();

  if (error || !data) return null;
  return data as OrderRow;
}

async function fetchOrderById(orderId: string): Promise<OrderRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("shop_orders")
    .select(
      "id, status, customer_name, customer_phone, total_mnt, payment_note, qpay_sender_invoice_no, payment_sms_sent_at, promo_id",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) return null;
  return data as OrderRow;
}

async function markPaid(orderId: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("shop_orders")
    .update({
      status: "PAID",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  return !error;
}

async function markSmsSent(orderId: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("shop_orders")
    .update({
      payment_sms_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);
}

export async function finalizeOrderPayment(input: {
  orderId?: string;
  invoiceId?: string;
}): Promise<{
  ok: boolean;
  orderId?: string;
  paid?: boolean;
  smsSent?: boolean;
}> {
  const order = input.invoiceId
    ? await fetchOrderByInvoice(input.invoiceId)
    : input.orderId
      ? await fetchOrderById(input.orderId)
      : null;

  if (!order) return { ok: false };

  const wasPaid = order.status === "PAID";

  if (!wasPaid) {
    const updated = await markPaid(order.id);
    if (!updated) return { ok: false, orderId: order.id };
    if (order.promo_id) {
      await incrementPromoUsage(order.promo_id);
    }
  }

  let smsSent = Boolean(order.payment_sms_sent_at);

  if (!smsSent) {
    const paymentRef =
      order.qpay_sender_invoice_no ??
      order.payment_note ??
      `ACHIRA-${order.id.slice(0, 8).toUpperCase()}`;

    const smsBody = buildOrderPaidSms({
      customerName: order.customer_name,
      totalMnt: order.total_mnt,
      paymentRef,
    });

    const result = await sendOrderPaidSms(order.customer_phone, smsBody);
    if (result.ok) {
      await markSmsSent(order.id);
      smsSent = true;
    }
  }

  return {
    ok: true,
    orderId: order.id,
    paid: true,
    smsSent,
  };
}

export async function markOrderPaidByQPayInvoice(
  invoiceId: string,
): Promise<{ ok: boolean; orderId?: string }> {
  const result = await finalizeOrderPayment({ invoiceId });
  return { ok: result.ok, orderId: result.orderId };
}

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
  subtotalMnt?: number;
  discountMnt?: number;
  promoCode?: string | null;
  promoId?: string | null;
}): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  const supabase = createSupabaseAdminClient();

  const subtotalMnt =
    input.subtotalMnt ??
    input.lines.reduce((sum, line) => sum + line.priceMnt * line.qty, 0);
  const discountMnt = input.discountMnt ?? 0;
  const totalMnt = Math.max(0, subtotalMnt - discountMnt);

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
      subtotal_mnt: subtotalMnt,
      discount_mnt: discountMnt,
      promo_code: input.promoCode ?? null,
      promo_id: input.promoId ?? null,
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
