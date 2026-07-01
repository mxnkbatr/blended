import { getApiBase } from "@/lib/api-base";
import { normalizeMongoliaPhone, toE164Phone } from "@/lib/auth/phone";

function apiBase() {
  return getApiBase();
}

export async function sendSmsCode(
  phone: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const local = normalizeMongoliaPhone(phone);
  if (!local) return { ok: false, error: "Утасны дугаар буруу байна." };

  try {
    const res = await fetch(`${apiBase()}/api/sms/send/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: toE164Phone(local) }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error ?? "Код илгээхэд алдаа гарлаа." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Серверт холбогдож чадсангүй." };
  }
}

export async function verifySmsCode(
  phone: string,
  code: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const local = normalizeMongoliaPhone(phone);
  if (!local) return { ok: false, error: "Утасны дугаар буруу байна." };

  try {
    const res = await fetch(`${apiBase()}/api/sms/verify/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: toE164Phone(local), code: code.trim() }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error ?? "Код буруу байна." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Серверт холбогдож чадсангүй." };
  }
}
