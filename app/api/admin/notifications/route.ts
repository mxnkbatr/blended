import { NextResponse } from "next/server";
import { sendPushToAllUsers } from "@/lib/firebase/fcm";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      title?: string;
      body?: string;
      createdBy?: string | null;
    };

    const title = body.title?.trim();
    const text = body.body?.trim();

    if (!title || title.length < 2) {
      return NextResponse.json({ error: "Гарчиг оруулна уу." }, { status: 400 });
    }
    if (!text || text.length < 2) {
      return NextResponse.json(
        { error: "Мэдэгдлийн текст оруулна уу." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: notification, error: notifError } = await supabase
      .from("app_notifications")
      .insert({
        title,
        body: text,
        created_by: body.createdBy ?? null,
      })
      .select("id")
      .single();

    if (notifError || !notification) {
      return NextResponse.json(
        { error: notifError?.message ?? "Мэдэгдэл үүсгэж чадсангүй." },
        { status: 500 },
      );
    }

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id");

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    const userIds = (profiles ?? []).map((p) => p.id);
    if (userIds.length === 0) {
      return NextResponse.json({
        ok: true,
        notificationId: notification.id,
        recipientCount: 0,
      });
    }

    const rows = userIds.map((userId) => ({
      user_id: userId,
      notification_id: notification.id,
    }));

    const { error: inboxError } = await supabase
      .from("user_notifications")
      .insert(rows);

    if (inboxError) {
      return NextResponse.json({ error: inboxError.message }, { status: 500 });
    }

    let pushSent = 0;
    try {
      const fcmResult = await sendPushToAllUsers({
        title,
        body: text,
        data: { notificationId: notification.id, url: "/notifications" },
      });
      pushSent = fcmResult?.multicast?.successCount ?? 0;
    } catch (pushErr) {
      console.error("[admin/notifications] push:", pushErr);
    }

    return NextResponse.json({
      ok: true,
      notificationId: notification.id,
      recipientCount: userIds.length,
      pushSent,
    });
  } catch (err) {
    console.error("[admin/notifications]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Алдаа гарлаа." },
      { status: 500 },
    );
  }
}
