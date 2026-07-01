/** Mongolia mobile: 8 digits, usually starts with 8 or 9 */
const PHONE_RE = /^[89]\d{7}$/;

export function normalizeMongoliaPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let local = digits;

  if (local.startsWith("976") && local.length === 11) {
    local = local.slice(3);
  }
  if (local.length !== 8 || !PHONE_RE.test(local)) return null;

  return local;
}

export function toE164Phone(local: string): string {
  return `+976${local}`;
}

/** Supabase email/password auth — утасны дугаараар (SMS шаардлагагүй) */
export function phoneToAuthEmail(phone: string): string {
  const local = normalizeMongoliaPhone(phone);
  if (!local) throw new Error("Утасны дугаар буруу байна.");
  return `${local}@phone.achira.mn`;
}

export function formatPhoneDisplay(phone: string): string {
  const local = normalizeMongoliaPhone(phone);
  if (!local) return phone;
  return `+976 ${local.slice(0, 4)} ${local.slice(4)}`;
}

export function validateMongoliaPhone(input: string): string | null {
  if (!normalizeMongoliaPhone(input)) {
    return "8 оронтой зөв утасны дугаар оруулна уу (жишээ: 99112233).";
  }
  return null;
}
