import {
  isBarberWorkingOnDate,
  isSlotWithinSchedule,
} from "@/lib/barbers/schedule";
import { normalizeMongoliaPhone } from "@/lib/auth/phone";
import { isQPayConfigured } from "@/lib/qpay/config";
import { createQPayInvoice } from "@/lib/qpay/server";
import {
  incrementPromoUsage,
  validateBookingPromo,
} from "@/lib/promo/server";
import type { PromoCodeRow } from "@/lib/promo/validate";
import {
  calculateBookingTotal,
  resolveBookingPriceMnt,
} from "@/lib/appointments/pricing";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildAppointmentOwnerSms, sendSms } from "@/lib/twilio/sms";

export type CreateAppointmentCheckoutInput = {
  barberId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  promoCode?: string;
};

type AppointmentPaymentRow = {
  id: string;
  status: string;
  barber_id: string;
  customer_name: string;
  customer_phone: string;
  starts_at: string;
  ends_at: string;
  price_mnt: number | null;
  promo_id: string | null;
  qpay_invoice_id: string | null;
  qpay_sender_invoice_no: string | null;
  payment_sms_sent_at: string | null;
};

function toMongoliaDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00+08:00`);
}

function getNotifyPhone(): string {
  return process.env.APPOINTMENT_NOTIFY_PHONE ?? "88668612";
}

async function isSlotTaken(
  barberId: string,
  startsAt: Date,
): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  const { count, error } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("barber_id", barberId)
    .eq("starts_at", startsAt.toISOString())
    .neq("status", "CANCELLED");

  if (error) return true;
  return (count ?? 0) > 0;
}

async function fetchAppointmentByInvoice(
  invoiceId: string,
): Promise<AppointmentPaymentRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id, status, barber_id, customer_name, customer_phone, starts_at, ends_at, price_mnt, promo_id, qpay_invoice_id, qpay_sender_invoice_no, payment_sms_sent_at",
    )
    .eq("qpay_invoice_id", invoiceId)
    .maybeSingle();

  if (error || !data) return null;
  return data as AppointmentPaymentRow;
}

async function fetchAppointmentById(
  appointmentId: string,
): Promise<AppointmentPaymentRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id, status, barber_id, customer_name, customer_phone, starts_at, ends_at, price_mnt, promo_id, qpay_invoice_id, qpay_sender_invoice_no, payment_sms_sent_at",
    )
    .eq("id", appointmentId)
    .maybeSingle();

  if (error || !data) return null;
  return data as AppointmentPaymentRow;
}

export async function createAppointmentCheckout(
  input: CreateAppointmentCheckoutInput,
): Promise<
  | {
      ok: true;
      id: string;
      paymentRef: string;
      subtotalMnt: number;
      discountMnt: number;
      totalMnt: number;
      qpay: {
        invoiceId: string;
        qrText: string | null;
        qrImage: string | null;
        shortUrl: string | null;
        urls: { name: string; description: string; logo: string; link: string }[];
      };
    }
  | { ok: false; error: string }
> {
  if (!isQPayConfigured()) {
    return { ok: false, error: "QPay тохиргоо хийгдээгүй." };
  }

  const customerName = input.customerName.trim();
  const customerPhone = input.customerPhone.trim();

  if (!customerName || !normalizeMongoliaPhone(customerPhone)) {
    return { ok: false, error: "Нэр, утасны дугаар зөв оруулна уу." };
  }

  if (!input.barberId || !input.date || !input.time) {
    return { ok: false, error: "Бабер, огноо, цаг сонгоно уу." };
  }

  const supabase = createSupabaseAdminClient();
  const startsAt = toMongoliaDateTime(input.date, input.time);
  const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);

  const { data: barber, error: barberError } = await supabase
    .from("barbers")
    .select("name, schedule, active, booking_price_mnt")
    .eq("id", input.barberId)
    .maybeSingle();

  if (barberError || !barber) {
    return { ok: false, error: "Бабер олдсонгүй." };
  }

  if (!barber.active) {
    return { ok: false, error: "Энэ бабер одоогоор идэвхгүй байна." };
  }

  if (!isBarberWorkingOnDate(barber.schedule, input.date)) {
    return { ok: false, error: "Энэ өдөр бабер ажиллахгүй." };
  }

  if (!isSlotWithinSchedule(barber.schedule, input.date, input.time)) {
    return { ok: false, error: "Сонгосон цаг боломжгүй байна." };
  }

  if (await isSlotTaken(input.barberId, startsAt)) {
    return { ok: false, error: "Энэ цаг аль хэдийн захиалагдсан байна." };
  }

  let appliedPromo: PromoCodeRow | null = null;
  if (input.promoCode?.trim()) {
    const promoCheck = await validateBookingPromo(
      input.promoCode,
      input.barberId,
    );
    if (!promoCheck.ok) {
      return { ok: false, error: promoCheck.error };
    }
    appliedPromo = promoCheck.promo;
  }

  const baseMnt = resolveBookingPriceMnt(
    (barber as { booking_price_mnt?: number | null }).booking_price_mnt,
  );
  const { subtotalMnt, discountMnt, totalMnt } = calculateBookingTotal(
    baseMnt,
    appliedPromo,
  );

  const senderInvoiceNo = `ACHIRA-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
  const description = `ACHIRA ARTIST — ${customerName} (${input.date} ${input.time})`;

  const invoice = await createQPayInvoice({
    senderInvoiceNo,
    description,
    amountMnt: totalMnt,
  });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      id,
      barber_id: input.barberId,
      customer_name: customerName,
      customer_phone: customerPhone,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "AWAITING_PAYMENT",
      promo_code: appliedPromo?.code ?? null,
      promo_id: appliedPromo?.id ?? null,
      subtotal_mnt: subtotalMnt,
      discount_mnt: discountMnt,
      price_mnt: totalMnt,
      qpay_invoice_id: invoice.invoice_id,
      qpay_sender_invoice_no: senderInvoiceNo,
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return { ok: false, error: "Энэ цаг аль хэдийн захиалагдсан байна." };
    }
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    id: data.id,
    paymentRef: senderInvoiceNo,
    subtotalMnt,
    discountMnt,
    totalMnt,
    qpay: {
      invoiceId: invoice.invoice_id,
      qrText: invoice.qr_text ?? null,
      qrImage: invoice.qr_image ?? null,
      shortUrl: invoice.qPay_shortUrl ?? null,
      urls: invoice.urls ?? [],
    },
  };
}

export async function getAppointmentPaymentState(appointmentId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id, status, qpay_invoice_id, price_mnt, qpay_sender_invoice_no",
    )
    .eq("id", appointmentId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function finalizeAppointmentPayment(input: {
  appointmentId?: string;
  invoiceId?: string;
}): Promise<{
  ok: boolean;
  appointmentId?: string;
  paid?: boolean;
  smsSent?: boolean;
}> {
  const appointment = input.invoiceId
    ? await fetchAppointmentByInvoice(input.invoiceId)
    : input.appointmentId
      ? await fetchAppointmentById(input.appointmentId)
      : null;

  if (!appointment) return { ok: false };

  const wasPaid = appointment.status !== "AWAITING_PAYMENT";

  if (!wasPaid) {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("appointments")
      .update({
        status: "PENDING",
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointment.id);

    if (error) return { ok: false, appointmentId: appointment.id };

    if (appointment.promo_id) {
      await incrementPromoUsage(appointment.promo_id);
    }
  }

  let smsSent = Boolean(appointment.payment_sms_sent_at);

  if (!smsSent) {
    const { data: barber } = await createSupabaseAdminClient()
      .from("barbers")
      .select("name")
      .eq("id", appointment.barber_id)
      .maybeSingle();

    const smsBody = buildAppointmentOwnerSms({
      barberName: barber?.name ?? appointment.barber_id,
      startsAt: new Date(appointment.starts_at),
      endsAt: new Date(appointment.ends_at),
      customerName: appointment.customer_name,
      customerPhone: appointment.customer_phone,
    });

    const smsResult = await sendSms(getNotifyPhone(), smsBody);
    if (smsResult.ok) {
      await createSupabaseAdminClient()
        .from("appointments")
        .update({
          payment_sms_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointment.id);
      smsSent = true;
    }
  }

  return {
    ok: true,
    appointmentId: appointment.id,
    paid: true,
    smsSent,
  };
}
