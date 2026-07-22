import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type CartLineInput = {
  slug: string;
  qty: number;
  name: string;
  priceMnt?: number;
  imageUrl?: string;
};

export type ResolvedCartLine = {
  slug: string;
  name: string;
  priceMnt: number;
  qty: number;
  imageUrl: string;
};

export async function validateCartStock(
  lines: CartLineInput[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (lines.length === 0) {
    return { ok: false, error: "Сагс хоосон байна." };
  }

  const supabase = createSupabaseAdminClient();
  const slugs = [...new Set(lines.map((line) => line.slug))];

  const { data, error } = await supabase
    .from("products")
    .select("slug, name, in_stock")
    .in("slug", slugs);

  if (error) {
    console.warn("[stock] validateCartStock:", error.message);
    return {
      ok: false,
      error: "Бүтээгдэхүүний мэдээлэл шалгахад алдаа гарлаа. Дахин оролдоно уу.",
    };
  }

  if (!data?.length || data.length !== slugs.length) {
    return {
      ok: false,
      error: "Сагсанд байгаа зарим бараа олдсонгүй. Дахин сонгоно уу.",
    };
  }

  const bySlug = new Map(data.map((row) => [row.slug, row]));

  for (const line of lines) {
    const product = bySlug.get(line.slug);
    if (!product) {
      return {
        ok: false,
        error: `«${line.name}» олдсонгүй. Сагсаас хасна уу.`,
      };
    }
    if (!product.in_stock) {
      return {
        ok: false,
        error: `«${product.name}» дууссан байна. Сагсаас хасна уу.`,
      };
    }
  }

  return { ok: true };
}

/** Re-resolve cart lines from DB so admin price/stock changes apply at checkout. */
export async function resolveCartLines(
  lines: CartLineInput[],
): Promise<
  | { ok: true; lines: ResolvedCartLine[]; subtotalMnt: number }
  | { ok: false; error: string }
> {
  const stockCheck = await validateCartStock(lines);
  if (!stockCheck.ok) return stockCheck;

  const supabase = createSupabaseAdminClient();
  const slugs = [...new Set(lines.map((line) => line.slug))];

  const { data, error } = await supabase
    .from("products")
    .select("slug, name, price_mnt, image_url, in_stock")
    .in("slug", slugs);

  if (error || !data?.length) {
    return {
      ok: false,
      error: "Бүтээгдэхүүний мэдээлэл авахад алдаа гарлаа.",
    };
  }

  const bySlug = new Map(data.map((row) => [row.slug, row]));
  const resolved: ResolvedCartLine[] = [];

  for (const line of lines) {
    const product = bySlug.get(line.slug);
    if (!product || !product.in_stock) {
      return {
        ok: false,
        error: `«${line.name}» одоо боломжгүй байна. Сагсаа шинэчилнэ үү.`,
      };
    }

    resolved.push({
      slug: product.slug,
      name: product.name,
      priceMnt: product.price_mnt,
      qty: line.qty,
      imageUrl: product.image_url ?? line.imageUrl ?? "",
    });
  }

  const subtotalMnt = resolved.reduce(
    (sum, line) => sum + line.priceMnt * line.qty,
    0,
  );

  return { ok: true, lines: resolved, subtotalMnt };
}
