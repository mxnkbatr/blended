export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  AWAITING_PAYMENT: "Төлбөр хүлээгдэж буй",
  PENDING: "Хүлээгдэж буй",
  CONFIRMED: "Баталгаажсан",
  CANCELLED: "Цуцлагдсан",
  COMPLETED: "Дууссан",
  NO_SHOW: "Ирээгүй",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Ноорог",
  AWAITING_PAYMENT: "Төлбөр хүлээгдэж буй",
  PAID: "Төлсөн",
  SHIPPED: "Илгээсэн",
  FULFILLED: "Биелсэн",
  COMPLETED: "Дууссан",
  CANCELLED: "Цуцлагдсан",
};

export function labelStatus(
  map: Record<string, string>,
  status: string,
): string {
  return map[status] ?? status;
}
