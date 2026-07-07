/** Deployed API base for Capacitor static build (native app). */
export function getApiBase(): string {
  if (typeof window === "undefined") return "";
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SMS_API_URL ??
    "";
  return base.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}
