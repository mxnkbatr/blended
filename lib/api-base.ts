/** Deployed API base for Capacitor static build (native app). */
export function getApiBase(): string {
  if (typeof window === "undefined") return "";
  // For normal web (localhost + Vercel), prefer relative requests.
  // For Capacitor/native builds, we must use an absolute host.
  try {
    // Lazy import to avoid bundling issues in non-client contexts.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Capacitor } = require("@capacitor/core") as typeof import("@capacitor/core");
    if (!Capacitor?.isNativePlatform?.()) return "";
  } catch {
    // If Capacitor isn't available, assume web.
    return "";
  }

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
