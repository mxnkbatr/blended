import { finalizeAppointmentPayment } from "@/lib/appointments/payment";
import { finalizeOrderPayment } from "@/lib/qpay/orders";
import {
  checkQPayInvoicePayment,
  isInvoicePaid,
} from "@/lib/qpay/server";
import { isQPayConfigured } from "@/lib/qpay/config";

export async function POST(req: Request) {
  if (!isQPayConfigured()) {
    return new Response("NOT_CONFIGURED", { status: 503 });
  }

  try {
    const body = (await req.json()) as { invoice_id?: string };
    const invoiceId = body.invoice_id?.trim();

    if (!invoiceId) {
      return new Response("MISSING_INVOICE", { status: 400 });
    }

    const check = await checkQPayInvoicePayment(invoiceId);
    if (!isInvoicePaid(check)) {
      return new Response("NOT_PAID", { status: 200 });
    }

    const orderResult = await finalizeOrderPayment({ invoiceId });
    if (orderResult.ok) {
      return new Response("SUCCESS", { status: 200 });
    }

    const appointmentResult = await finalizeAppointmentPayment({ invoiceId });
    if (!appointmentResult.ok) {
      return new Response("NOT_FOUND", { status: 404 });
    }

    return new Response("SUCCESS", { status: 200 });
  } catch (err) {
    console.error("[qpay/callback]", err);
    return new Response("ERROR", { status: 500 });
  }
}
