import { normalizeMongoliaPhone, toE164Phone } from "@/lib/auth/phone";
import { getTwilioClient } from "@/lib/twilio/server";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n);
}

export function buildOrderPaidSms(input: {
  customerName: string;
  totalMnt: number;
  paymentRef: string;
}): string {
  return `ACHIRA ARTIST: Сайн байна уу ${input.customerName}, ${formatMnt(input.totalMnt)}₮ төлбөр амжилттай. Захиалга: ${input.paymentRef}. Баярлалаа!`;
}

export async function sendSms(
  phone: string,
  body: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const local = normalizeMongoliaPhone(phone);
  if (!local) {
    return { ok: false, error: "Утасны дугаар буруу." };
  }

  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const fromNumber =
    process.env.TWILIO_FROM_NUMBER ?? process.env.TWILIO_PHONE_NUMBER;

  if (!messagingServiceSid && !fromNumber) {
    console.warn("[sms] TWILIO_FROM_NUMBER эсвэл TWILIO_MESSAGING_SERVICE_SID байхгүй.");
    return { ok: false, error: "SMS тохиргоо дутуу." };
  }

  try {
    const client = getTwilioClient();
    const to = toE164Phone(local);

    if (messagingServiceSid) {
      await client.messages.create({
        to,
        body,
        messagingServiceSid,
      });
    } else {
      await client.messages.create({
        to,
        from: fromNumber!,
        body,
      });
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "SMS илгээхэд алдаа.";
    console.error("[sms]", message);
    return { ok: false, error: message };
  }
}

export async function sendOrderPaidSms(
  phone: string,
  body: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return sendSms(phone, body);
}

export function buildAppointmentOwnerSms(input: {
  barberName: string;
  startsAt: Date;
  endsAt: Date;
  customerName: string;
  customerPhone: string;
}): string {
  const dateLabel = new Intl.DateTimeFormat("mn-MN", {
    timeZone: "Asia/Ulaanbaatar",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(input.startsAt);

  const startTime = new Intl.DateTimeFormat("mn-MN", {
    timeZone: "Asia/Ulaanbaatar",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(input.startsAt);

  const endTime = new Intl.DateTimeFormat("mn-MN", {
    timeZone: "Asia/Ulaanbaatar",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(input.endsAt);

  return `ACHIRA ARTIST: Шинэ цаг захиалга. Бабер: ${input.barberName}. ${dateLabel}, ${startTime}-${endTime}. Захиалагч: ${input.customerName} (${input.customerPhone}).`;
}

export function buildAppointmentCustomerSms(input: {
  customerName: string;
  barberName: string;
  startsAt: Date;
  endsAt: Date;
  paymentRef?: string | null;
}): string {
  const dateLabel = new Intl.DateTimeFormat("mn-MN", {
    timeZone: "Asia/Ulaanbaatar",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(input.startsAt);

  const startTime = new Intl.DateTimeFormat("mn-MN", {
    timeZone: "Asia/Ulaanbaatar",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(input.startsAt);

  const endTime = new Intl.DateTimeFormat("mn-MN", {
    timeZone: "Asia/Ulaanbaatar",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(input.endsAt);

  const ref = input.paymentRef ? ` Дугаар: ${input.paymentRef}.` : "";

  return `achira.mn: Сайн байна уу ${input.customerName}, таны ${dateLabel} ${startTime}-${endTime} цагийн захиалга баталгаажлаа. Бабер: ${input.barberName}.${ref} Цагтаа ирнэ үү, хоцрохгүй байна уу. Баярлалаа!`;
}
