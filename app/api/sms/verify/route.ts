import { NextResponse } from "next/server";
import { getTwilioClient, getVerifyServiceSid } from "@/lib/twilio/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { phone?: string; code?: string };
    const phone = body.phone?.trim();
    const code = body.code?.trim();

    if (!phone || !/^\+976[89]\d{7}$/.test(phone)) {
      return NextResponse.json({ error: "Утасны дугаар буруу." }, { status: 400 });
    }
    if (!code || !/^\d{4,8}$/.test(code)) {
      return NextResponse.json({ error: "Баталгаажуулах код оруулна уу." }, { status: 400 });
    }

    const client = getTwilioClient();
    const serviceSid = getVerifyServiceSid();

    const check = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone, code });

    if (check.status !== "approved") {
      return NextResponse.json({ error: "Код буруу эсвэл хугацаа дууссан." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Twilio алдаа";
    console.error("[sms/verify]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
