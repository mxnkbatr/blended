import { NextResponse } from "next/server";
import { getTwilioClient, getVerifyServiceSid } from "@/lib/twilio/server";

const lastSent = new Map<string, number>();
const COOLDOWN_MS = 60_000;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { phone?: string };
    const phone = body.phone?.trim();

    if (!phone || !/^\+976[89]\d{7}$/.test(phone)) {
      return NextResponse.json(
        { error: "Зөв Монгол утасны дугаар оруулна уу (+976...)." },
        { status: 400 },
      );
    }

    const last = lastSent.get(phone) ?? 0;
    if (Date.now() - last < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 1000);
      return NextResponse.json(
        { error: `${wait} секундийн дараа дахин оролдоно уу.` },
        { status: 429 },
      );
    }

    const client = getTwilioClient();
    const serviceSid = getVerifyServiceSid();

    await client.verify.v2.services(serviceSid).verifications.create({
      to: phone,
      channel: "sms",
    });

    lastSent.set(phone, Date.now());

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Twilio алдаа";
    console.error("[sms/send]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
