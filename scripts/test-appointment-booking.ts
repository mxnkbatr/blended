import { config } from "dotenv";
import pg from "pg";
import twilio from "twilio";
import {
  buildAppointmentCustomerSms,
  buildAppointmentOwnerSms,
  sendSms,
} from "../lib/twilio/sms";
import {
  createAppointmentCheckout,
  finalizeAppointmentPayment,
} from "../lib/appointments/payment";

config({ path: ".env.local" });
config();

const PHONE = "99918122";
const DATE = "2026-07-07";
const TIME = "16:00";
const BARBER_ID = process.argv[2] ?? "b1";
const CUSTOMER_NAME = process.argv[3] ?? "Туршилт";

async function resolveBarberId(client: pg.Client): Promise<string> {
  const { rows } = await client.query<{ id: string; name: string }>(
    "select id, name from public.barbers where active = true order by created_at nulls last limit 5",
  );
  if (rows.length === 0) return BARBER_ID;
  const match = rows.find((r) => r.id === BARBER_ID) ?? rows[0];
  console.log(`Barber: ${match.name} (${match.id})`);
  return match.id;
}

async function discoverTwilioFrom(): Promise<string | null> {
  const from =
    process.env.TWILIO_FROM_NUMBER ?? process.env.TWILIO_PHONE_NUMBER ?? null;
  if (from) return from;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  if (!accountSid || !apiKeySid || !apiKeySecret) return null;

  try {
    const client = twilio(apiKeySid, apiKeySecret, { accountSid });
    const nums = await client.incomingPhoneNumbers.list({ limit: 1 });
    if (nums[0]?.phoneNumber) {
      console.log(`Auto-discovered Twilio from: ${nums[0].phoneNumber}`);
      process.env.TWILIO_FROM_NUMBER = nums[0].phoneNumber;
      return nums[0].phoneNumber;
    }
  } catch (err) {
    console.warn(
      "Twilio number discovery failed:",
      err instanceof Error ? err.message : err,
    );
  }
  return null;
}

async function main() {
  const connectionString =
    process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
  if (!connectionString) throw new Error("DATABASE_URL required.");

  const client = new pg.Client({ connectionString });
  await client.connect();

  const barberId = await resolveBarberId(client);

  const from = await discoverTwilioFrom();
  if (!from) {
    console.error(
      "TWILIO_FROM_NUMBER тохируулаагүй. Twilio console-оос илгээх дугаар авч .env.local дээр нэмнэ үү.",
    );
    process.exit(1);
  }

  console.log(`Creating appointment: ${DATE} ${TIME} → ${PHONE}`);
  const checkout = await createAppointmentCheckout({
    barberId,
    date: DATE,
    time: TIME,
    customerName: CUSTOMER_NAME,
    customerPhone: PHONE,
  });

  if (!checkout.ok) {
    console.error("Checkout failed:", checkout.error);
    await client.end();
    process.exit(1);
  }

  console.log("Appointment ID:", checkout.id);
  console.log("QPay invoice:", checkout.qpay.invoiceId);
  console.log("Payment ref:", checkout.paymentRef);
  if (checkout.qpay.shortUrl) {
    console.log("Pay URL:", checkout.qpay.shortUrl);
  }

  const { rows } = await client.query<{ name: string }>(
    "select name from public.barbers where id = $1",
    [barberId],
  );
  const barberName = rows[0]?.name ?? barberId;
  const startsAt = new Date(`${DATE}T${TIME}:00+08:00`);
  const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);

  console.log("\nSending test SMS (customer)...");
  const customerBody = buildAppointmentCustomerSms({
    customerName: CUSTOMER_NAME,
    barberName,
    startsAt,
    endsAt,
    paymentRef: checkout.paymentRef,
  });
  const customerSms = await sendSms(PHONE, customerBody);
  console.log("Customer SMS:", customerSms.ok ? "OK" : customerSms.error);

  const ownerBody = buildAppointmentOwnerSms({
    barberName,
    startsAt,
    endsAt,
    customerName: CUSTOMER_NAME,
    customerPhone: PHONE,
  });
  const ownerPhone = process.env.APPOINTMENT_NOTIFY_PHONE ?? "88668612";
  const ownerSms = await sendSms(ownerPhone, ownerBody);
  console.log("Owner SMS:", ownerSms.ok ? "OK" : ownerSms.error);

  console.log(
    "\nNote: Appointment stays AWAITING_PAYMENT until QPay is paid.",
  );
  console.log("After payment, finalize runs automatically via polling/callback.");

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
