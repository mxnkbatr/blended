import { NextResponse } from "next/server";
import { subscribeTokenToTopic, PUSH_TOPIC_ALL } from "@/lib/firebase/fcm";
import {
  isFcmRegistrationToken,
  registerPushToken,
} from "@/lib/supabase/push-tokens";
import { getUserFromRequest } from "@/lib/supabase/server-auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      token?: string;
      platform?: string;
    };

    const token = body.token?.trim();
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const platform = body.platform?.trim() || "unknown";

    if (platform === "ios" && !isFcmRegistrationToken(token)) {
      return NextResponse.json(
        { error: "Invalid FCM token for iOS" },
        { status: 400 },
      );
    }

    await registerPushToken({
      userId: user.id,
      token,
      platform,
    });

    if (isFcmRegistrationToken(token)) {
      await subscribeTokenToTopic(token, PUSH_TOPIC_ALL);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notifications/register-token]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}
