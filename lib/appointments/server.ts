import { validateBookingPromo, incrementPromoUsage } from "@/lib/promo/server";
import { normalizeMongoliaPhone } from "@/lib/auth/phone";
import {
  isBarberWorkingOnDate,
  isSlotWithinSchedule,
} from "@/lib/barbers/schedule";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildAppointmentOwnerSms, sendSms } from "@/lib/twilio/sms";

export type CreateAppointmentServerInput = {
  barberId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  promoCode?: string;
};

function toMongoliaDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00+08:00`);
}

function getNotifyPhone(): string {
  return process.env.APPOINTMENT_NOTIFY_PHONE ?? "88668612";
}

export async function createAppointmentWithNotify(
  input: CreateAppointmentServerInput,
): Promise<
  { ok: true; id: string; smsSent: boolean } | { ok: false; error: string }
> {
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
  const id = crypto.randomUUID();

  const { data: barber, error: barberError } = await supabase
    .from("barbers")
    .select("name, schedule, active")
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

  let appliedPromoCode: string | null = null;
  let appliedPromoId: string | null = null;
  if (input.promoCode?.trim()) {
    const promoCheck = await validateBookingPromo(
      input.promoCode,
      input.barberId,
    );
    if (!promoCheck.ok) {
      return { ok: false, error: promoCheck.error };
    }
    appliedPromoCode = promoCheck.promo.code;
    appliedPromoId = promoCheck.promo.id;
  }

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
      status: "PENDING",
      promo_code: appliedPromoCode,
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

  if (appliedPromoId) {
    await incrementPromoUsage(appliedPromoId);
  }

  const smsBody = buildAppointmentOwnerSms({
    barberName: barber.name,
    startsAt,
    endsAt,
    customerName,
    customerPhone,
  });

  const smsResult = await sendSms(getNotifyPhone(), smsBody);

  return { ok: true, id: data.id, smsSent: smsResult.ok };
}
