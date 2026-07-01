/** API base for Capacitor production (optional). Dev: same origin. */
export function getApiBase(): string {
  if (typeof window === "undefined") return "";
  return process.env.NEXT_PUBLIC_SMS_API_URL ?? "";
}
