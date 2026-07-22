import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdminFromRequest } from "@/lib/supabase/server-auth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export async function POST(req: Request) {
  try {
    const adminUser = await requireAdminFromRequest(req);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Зураг сонгоно уу." }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Зөвхөн зураг файл оруулна уу." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Зураг 5MB-аас бага байх ёстой." },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "heic", "heif"].includes(ext)
      ? ext
      : "jpg";
    const path = `${crypto.randomUUID()}.${safeExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const admin = createSupabaseAdminClient();

    const { error } = await admin.storage
      .from("barber-images")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = admin.storage.from("barber-images").getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("[upload-barber-image]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload алдаа." },
      { status: 500 },
    );
  }
}
