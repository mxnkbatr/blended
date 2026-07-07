import { NextResponse } from "next/server";
import {
  normalizeMongoliaPhone,
  phoneToAuthEmail,
  toE164Phone,
} from "@/lib/auth/phone";
import { isBootstrapAdminPhone } from "@/lib/auth/bootstrap-admins";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTwilioClient, getVerifyServiceSid } from "@/lib/twilio/server";

function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already") || m.includes("registered") || m.includes("exists")) {
    return "Энэ утасны дугаар аль хэдийн бүртгэлтэй. Нэвтрэх хэсэг рүү орно уу.";
  }
  if (m.includes("rate limit")) {
    return "Хэт олон оролдлого. 1-2 цагийн дараа дахин оролдоно уу.";
  }
  if (m.includes("password")) {
    return "Нууц үг хэт богино эсвэл буруу байна.";
  }
  return message;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      phone?: string;
      password?: string;
      name?: string;
      code?: string;
    };

    const local = body.phone ? normalizeMongoliaPhone(body.phone) : null;
    const password = body.password?.trim();
    const name = body.name?.trim();
    const code = body.code?.trim();

    if (!local) {
      return NextResponse.json(
        { error: "8 оронтой зөв утасны дугаар оруулна уу." },
        { status: 400 },
      );
    }
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Нэрээ оруулна уу." }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой." },
        { status: 400 },
      );
    }
    if (!code || !/^\d{4,8}$/.test(code)) {
      return NextResponse.json(
        { error: "SMS баталгаажуулах код оруулна уу." },
        { status: 400 },
      );
    }

    const e164 = toE164Phone(local);
    const twilio = getTwilioClient();
    const serviceSid = getVerifyServiceSid();

    const check = await twilio.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: e164, code });

    if (check.status !== "approved") {
      return NextResponse.json(
        { error: "SMS код буруу эсвэл хугацаа дууссан. Шинэ код авна уу." },
        { status: 400 },
      );
    }

    const email = phoneToAuthEmail(local);
    const admin = createSupabaseAdminClient();

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, phone: local },
    });

    if (error) {
      return NextResponse.json(
        { error: mapAuthError(error.message) },
        { status: 400 },
      );
    }

    const userId = data.user.id;

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: userId,
        full_name: name,
        phone: local,
        role: isBootstrapAdminPhone(local) ? "admin" : "customer",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (profileError) {
      console.error("[auth/register] profile:", profileError.message);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Бүртгэлийн алдаа";
    console.error("[auth/register]", msg);
    return NextResponse.json({ error: mapAuthError(msg) }, { status: 500 });
  }
}
