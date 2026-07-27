export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  AWAITING_PAYMENT: "Төлбөр хүлээгдэж буй",
  PENDING: "Шинэ захиалга",
  CONFIRMED: "Баталгаажсан · төлсөн",
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

export type StatusTone =
  | "neutral"
  | "warning"
  | "success"
  | "danger"
  | "info"
  | "muted";

export function appointmentStatusTone(status: string): StatusTone {
  switch (status) {
    case "AWAITING_PAYMENT":
      return "warning";
    case "PENDING":
      return "info";
    case "CONFIRMED":
      return "success";
    case "COMPLETED":
      return "muted";
    case "CANCELLED":
    case "NO_SHOW":
      return "danger";
    default:
      return "neutral";
  }
}

export function orderStatusTone(status: string): StatusTone {
  switch (status) {
    case "AWAITING_PAYMENT":
    case "DRAFT":
      return "warning";
    case "PAID":
      return "success";
    case "SHIPPED":
    case "FULFILLED":
      return "info";
    case "COMPLETED":
      return "muted";
    case "CANCELLED":
      return "danger";
    default:
      return "neutral";
  }
}

export function labelStatus(
  map: Record<string, string>,
  status: string,
): string {
  return map[status] ?? status;
}
