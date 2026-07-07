import { NextResponse } from "next/server";
import {
  createAppointmentCheckout,
  finalizeAppointmentPayment,
  getAppointmentPaymentState,
} from "@/lib/appointments/payment";
import { isQPayConfigured } from "@/lib/qpay/config";
import {
  checkQPayInvoicePayment,
  isInvoicePaid,
} from "@/lib/qpay/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      barberId?: string;
      date?: string;
      time?: string;
      customerName?: string;
      customerPhone?: string;
      promoCode?: string;
    };

    const result = await createAppointmentCheckout({
      barberId: body.barberId ?? "",
      date: body.date ?? "",
      time: body.time ?? "",
      customerName: body.customerName ?? "",
      customerPhone: body.customerPhone ?? "",
      promoCode: body.promoCode,
    });

    if (!result.ok) {
      const status = result.error.includes("QPay") ? 503 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({
      id: result.id,
      paymentRef: result.paymentRef,
      subtotalMnt: result.subtotalMnt,
      discountMnt: result.discountMnt,
      totalMnt: result.totalMnt,
      qpay: result.qpay,
    });
  } catch (err) {
    console.error("[appointments]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Серверийн алдаа." },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const appointmentId = new URL(req.url).searchParams.get("appointmentId");
  if (!appointmentId) {
    return NextResponse.json(
      { error: "appointmentId шаардлагатай." },
      { status: 400 },
    );
  }

  try {
    const appointment = await getAppointmentPaymentState(appointmentId);
    if (!appointment) {
      return NextResponse.json(
        { error: "Захиалга олдсонгүй." },
        { status: 404 },
      );
    }

    if (appointment.status !== "AWAITING_PAYMENT") {
      return NextResponse.json({
        paid: true,
        status: appointment.status,
      });
    }

    if (!appointment.qpay_invoice_id || !isQPayConfigured()) {
      return NextResponse.json({
        paid: false,
        status: appointment.status,
      });
    }

    const check = await checkQPayInvoicePayment(appointment.qpay_invoice_id);
    if (isInvoicePaid(check)) {
      const result = await finalizeAppointmentPayment({
        invoiceId: appointment.qpay_invoice_id,
      });
      return NextResponse.json({
        paid: true,
        status: "PENDING",
        smsSent: result.smsSent ?? false,
      });
    }

    return NextResponse.json({
      paid: false,
      status: appointment.status,
    });
  } catch (err) {
    console.error("[appointments/check]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Шалгахад алдаа." },
      { status: 500 },
    );
  }
}
