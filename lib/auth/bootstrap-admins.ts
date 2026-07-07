import { normalizeMongoliaPhone } from "@/lib/auth/phone";

/** Эхний админууд — бүртгэл/нэвтрэх үед автоматаар admin эрх олгоно */
export const BOOTSTRAP_ADMIN_PHONES = ["99918122", "88668612"] as const;

export function isBootstrapAdminPhone(phone: string): boolean {
  const local = normalizeMongoliaPhone(phone);
  if (!local) return false;
  return (BOOTSTRAP_ADMIN_PHONES as readonly string[]).includes(local);
}
