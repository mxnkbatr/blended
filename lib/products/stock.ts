import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type CartLineInput = {
  slug: string;
  qty: number;
  name: string;
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
    return { ok: true };
  }

  if (!data?.length) {
    return { ok: true };
  }

  const bySlug = new Map(data.map((row) => [row.slug, row]));

  for (const line of lines) {
    const product = bySlug.get(line.slug);
    if (product && !product.in_stock) {
      return {
        ok: false,
        error: `«${product.name}» дууссан байна. Сагсаас хасна уу.`,
      };
    }
  }

  return { ok: true };
}
