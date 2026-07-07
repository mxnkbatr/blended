export const DEFAULT_BOOKING_PRICE_MNT = 50000;

export function resolveBookingPriceMnt(
  value: number | null | undefined,
): number {
  if (value != null && Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }

  const env = Number(
    process.env.APPOINTMENT_PRICE_MNT ?? String(DEFAULT_BOOKING_PRICE_MNT),
  );
  return Number.isFinite(env) && env >= 0
    ? Math.floor(env)
    : DEFAULT_BOOKING_PRICE_MNT;
}

export function formatBookingPriceMnt(n: number): string {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

export function calculateBookingTotal(
  baseMnt: number,
  promo?: { discount_percent: number } | null,
): { subtotalMnt: number; discountMnt: number; totalMnt: number } {
  const subtotalMnt = baseMnt;
  const discountMnt = promo
    ? Math.floor((subtotalMnt * promo.discount_percent) / 100)
    : 0;
  const totalMnt = Math.max(0, subtotalMnt - discountMnt);
  return { subtotalMnt, discountMnt, totalMnt };
}
