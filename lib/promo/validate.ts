import type { CartLine } from "@/components/providers/CartProvider";

export type PromoCodeRow = {
  id: string;
  code: string;
  discount_percent: number;
  barber_ids: string[];
  product_slugs: string[];
  applies_shop: boolean;
  applies_booking: boolean;
  active: boolean;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
};

export type PromoLineInput = {
  slug: string;
  priceMnt: number;
  qty: number;
};

export type PromoDiscountResult = {
  subtotalMnt: number;
  discountMnt: number;
  totalMnt: number;
  eligibleSlugs: string[];
};

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

function isUsageExceeded(row: PromoCodeRow): boolean {
  if (row.max_uses == null) return false;
  return row.used_count >= row.max_uses;
}

export function getEligibleShopSlugs(
  lines: PromoLineInput[],
  promo: Pick<PromoCodeRow, "product_slugs">,
): string[] {
  const slugs = lines.map((l) => l.slug);
  if (!promo.product_slugs?.length) return slugs;
  return slugs.filter((slug) => promo.product_slugs.includes(slug));
}

export function calculateShopDiscount(
  lines: PromoLineInput[],
  promo: Pick<PromoCodeRow, "discount_percent" | "product_slugs">,
): PromoDiscountResult {
  const subtotalMnt = lines.reduce(
    (sum, line) => sum + line.priceMnt * line.qty,
    0,
  );
  const eligibleSlugs = getEligibleShopSlugs(lines, promo);

  const eligibleSubtotal = lines.reduce((sum, line) => {
    if (!eligibleSlugs.includes(line.slug)) return sum;
    return sum + line.priceMnt * line.qty;
  }, 0);

  const discountMnt = Math.floor(
    (eligibleSubtotal * promo.discount_percent) / 100,
  );
  const totalMnt = Math.max(0, subtotalMnt - discountMnt);

  return { subtotalMnt, discountMnt, totalMnt, eligibleSlugs };
}

export function validatePromoRowForShop(
  promo: PromoCodeRow | null,
  lines: PromoLineInput[],
): { ok: true; result: PromoDiscountResult } | { ok: false; error: string } {
  if (!promo) {
    return { ok: false, error: "Промо код олдсонгүй." };
  }
  if (!promo.active) {
    return { ok: false, error: "Энэ промо код идэвхгүй байна." };
  }
  if (!promo.applies_shop) {
    return { ok: false, error: "Энэ код дэлгүүрийн захиалгад хэрэглэгдэхгүй." };
  }
  if (isExpired(promo.expires_at)) {
    return { ok: false, error: "Промо кодын хугацаа дууссан." };
  }
  if (isUsageExceeded(promo)) {
    return { ok: false, error: "Промо кодын хязгаар дууссан." };
  }
  if (lines.length === 0) {
    return { ok: false, error: "Сагс хоосон байна." };
  }

  const eligibleSlugs = getEligibleShopSlugs(lines, promo);
  if (eligibleSlugs.length === 0) {
    return {
      ok: false,
      error: "Энэ промо код сагсанд байгаа бараанд хамаарахгүй.",
    };
  }

  return {
    ok: true,
    result: calculateShopDiscount(lines, promo),
  };
}

export function validatePromoRowForBooking(
  promo: PromoCodeRow | null,
  barberId: string,
): { ok: true } | { ok: false; error: string } {
  if (!promo) {
    return { ok: false, error: "Промо код олдсонгүй." };
  }
  if (!promo.active) {
    return { ok: false, error: "Энэ промо код идэвхгүй байна." };
  }
  if (!promo.applies_booking) {
    return { ok: false, error: "Энэ код цаг захиалгад хэрэглэгдэхгүй." };
  }
  if (isExpired(promo.expires_at)) {
    return { ok: false, error: "Промо кодын хугацаа дууссан." };
  }
  if (isUsageExceeded(promo)) {
    return { ok: false, error: "Промо кодын хязгаар дууссан." };
  }
  if (promo.barber_ids?.length && !promo.barber_ids.includes(barberId)) {
    return {
      ok: false,
      error: "Энэ промо код сонгосон баберт хамаарахгүй.",
    };
  }

  return { ok: true };
}
