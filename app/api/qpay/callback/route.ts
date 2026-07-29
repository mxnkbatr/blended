import { finalizeAppointmentPayment } from "@/lib/appointments/payment";
import { finalizeOrderPayment } from "@/lib/qpay/orders";
import {
  checkQPayInvoicePayment,
  isInvoicePaid,
} from "@/lib/qpay/server";
import { isQPayConfigured } from "@/lib/qpay/config";

async function handleCallback(invoiceId: string) {
  const check = await checkQPayInvoicePayment(invoiceId);
  if (!isInvoicePaid(check)) {
    return new Response("NOT_PAID", { status: 200 });
  }

  const orderResult = await finalizeOrderPayment({ invoiceId });
  if (orderResult.ok && orderResult.paid) {
    return new Response("SUCCESS", { status: 200 });
  }

  const appointmentResult = await finalizeAppointmentPayment({ invoiceId });
  if (!appointmentResult.ok) {
    return new Response("NOT_FOUND", { status: 404 });
  }

  if (!appointmentResult.paid) {
    return new Response("NOT_PAID", { status: 200 });
  }

  return new Response("SUCCESS", { status: 200 });
}

function extractInvoiceId(req: Request, body: unknown): string | null {
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    const fromBody =
      (typeof o.invoice_id === "string" && o.invoice_id) ||
      (typeof o.invoiceId === "string" && o.invoiceId) ||
      null;
    if (fromBody?.trim()) return fromBody.trim();
  }

  const fromQuery = new URL(req.url).searchParams.get("invoice_id");
  return fromQuery?.trim() || null;
}

export async function POST(req: Request) {
  if (!isQPayConfigured()) {
    return new Response("NOT_CONFIGURED", { status: 503 });
  }

  try {
    let body: unknown = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }

    const invoiceId = extractInvoiceId(req, body);
    if (!invoiceId) {
      return new Response("MISSING_INVOICE", { status: 400 });
    }

    return await handleCallback(invoiceId);
  } catch (err) {
    console.error("[qpay/callback]", err);
    return new Response("ERROR", { status: 500 });
  }
}

/** Зарим QPay тохиргоо GET callback ашигладаг */
export async function GET(req: Request) {
  if (!isQPayConfigured()) {
    return new Response("NOT_CONFIGURED", { status: 503 });
  }

  try {
    const invoiceId = extractInvoiceId(req, null);
    if (!invoiceId) {
      return new Response("MISSING_INVOICE", { status: 400 });
    }
    return await handleCallback(invoiceId);
  } catch (err) {
    console.error("[qpay/callback GET]", err);
    return new Response("ERROR", { status: 500 });
  }
}
