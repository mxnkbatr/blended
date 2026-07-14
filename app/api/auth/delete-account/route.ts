import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getUserFromRequest } from "@/lib/supabase/server-auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Нэвтрэх шаардлагатай." }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      confirm?: string;
    };

    if (body.confirm !== "DELETE") {
      return NextResponse.json(
        { error: 'Батлахын тулд confirm: "DELETE" илгээнэ үү.' },
        { status: 400 },
      );
    }

    const admin = createSupabaseAdminClient();
    const userId = user.id;

    const { data: profile } = await admin
      .from("profiles")
      .select("phone")
      .eq("id", userId)
      .maybeSingle();

    const phone =
      (profile?.phone as string | undefined)?.trim() ||
      (user.user_metadata?.phone as string | undefined)?.trim() ||
      "";

    await admin.from("push_tokens").delete().eq("user_id", userId);
    await admin.from("user_notifications").delete().eq("user_id", userId);

    if (phone) {
      await admin
        .from("appointments")
        .update({
          customer_name: "Устгасан хэрэглэгч",
          customer_phone: `deleted-${userId.slice(0, 8)}`,
        })
        .eq("customer_phone", phone);

      await admin
        .from("shop_orders")
        .update({
          customer_name: "Устгасан хэрэглэгч",
          customer_phone: `deleted-${userId.slice(0, 8)}`,
          user_id: null,
        })
        .eq("user_id", userId);
    } else {
      await admin
        .from("shop_orders")
        .update({
          customer_name: "Устгасан хэрэглэгч",
          customer_phone: `deleted-${userId.slice(0, 8)}`,
          user_id: null,
        })
        .eq("user_id", userId);
    }

    await admin.from("profiles").delete().eq("id", userId);

    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error("[auth/delete-account]", deleteError);
      return NextResponse.json(
        { error: deleteError.message || "Бүртгэл устгахад алдаа гарлаа." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[auth/delete-account]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}
