import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  normalizePromoCode,
  type PromoCodeRow,
  validatePromoRowForBooking,
  validatePromoRowForShop,
  type PromoLineInput,
} from "@/lib/promo/validate";

export async function fetchPromoByCode(
  code: string,
): Promise<PromoCodeRow | null> {
  const normalized = normalizePromoCode(code);
  if (!normalized) return null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select(
      "id, code, discount_percent, barber_ids, product_slugs, applies_shop, applies_booking, active, max_uses, used_count, expires_at",
    )
    .eq("code", normalized)
    .maybeSingle();

  if (error || !data) return null;
  return data as PromoCodeRow;
}

export async function validateShopPromo(
  code: string,
  lines: PromoLineInput[],
): Promise<
  | {
      ok: true;
      promo: PromoCodeRow;
      subtotalMnt: number;
      discountMnt: number;
      totalMnt: number;
    }
  | { ok: false; error: string }
> {
  const promo = await fetchPromoByCode(code);
  const check = validatePromoRowForShop(promo, lines);
  if (!check.ok) return check;
  return {
    ok: true,
    promo: promo!,
    ...check.result,
  };
}

export async function validateBookingPromo(
  code: string,
  barberId: string,
): Promise<{ ok: true; promo: PromoCodeRow } | { ok: false; error: string }> {
  const promo = await fetchPromoByCode(code);
  const check = validatePromoRowForBooking(promo, barberId);
  if (!check.ok) return check;
  return { ok: true, promo: promo! };
}

export async function incrementPromoUsage(promoId: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("promo_codes")
    .select("used_count")
    .eq("id", promoId)
    .maybeSingle();

  if (!data) return;

  await supabase
    .from("promo_codes")
    .update({
      used_count: (data.used_count ?? 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", promoId);
}
