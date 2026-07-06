import { getQPayConfig } from "./config";
import type {
  QPayInvoiceResponse,
  QPayPaymentCheckResponse,
  QPayTokenResponse,
} from "./types";

type TokenCache = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
};

let tokenCache: TokenCache | null = null;

function storeToken(data: QPayTokenResponse): TokenCache {
  const now = Date.now();
  const safetyMs = 30_000;

  tokenCache = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessExpiresAt: now + Math.max(data.expires_in * 1000 - safetyMs, 0),
    refreshExpiresAt: now + Math.max(data.refresh_expires_in * 1000 - safetyMs, 0),
  };

  return tokenCache;
}

async function authenticate(): Promise<string> {
  const { authUrl, clientName, password } = getQPayConfig();
  const basic = Buffer.from(`${clientName}:${password}`).toString("base64");

  const res = await fetch(authUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`QPay auth алдаа (${res.status}): ${body}`);
  }

  const data = (await res.json()) as QPayTokenResponse;
  return storeToken(data).accessToken;
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const { baseUrl } = getQPayConfig();

  const res = await fetch(`${baseUrl}/v2/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    tokenCache = null;
    return authenticate();
  }

  const data = (await res.json()) as QPayTokenResponse;
  return storeToken(data).accessToken;
}

export async function getQPayAccessToken(): Promise<string> {
  const now = Date.now();

  if (tokenCache && tokenCache.accessExpiresAt > now) {
    return tokenCache.accessToken;
  }

  if (tokenCache && tokenCache.refreshExpiresAt > now) {
    return refreshAccessToken(tokenCache.refreshToken);
  }

  return authenticate();
}

async function qpayFetch<T>(
  path: string,
  init: RequestInit,
  retry = true,
): Promise<T> {
  const { baseUrl } = getQPayConfig();
  const token = await getQPayAccessToken();

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });

  if (res.status === 401 && retry) {
    tokenCache = null;
    return qpayFetch<T>(path, init, false);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`QPay ${path} алдаа (${res.status}): ${body}`);
  }

  return (await res.json()) as T;
}

export async function createQPayInvoice(input: {
  senderInvoiceNo: string;
  description: string;
  amountMnt: number;
}): Promise<QPayInvoiceResponse> {
  const { invoiceCode, callbackUrl } = getQPayConfig();

  return qpayFetch<QPayInvoiceResponse>("/v2/invoice", {
    method: "POST",
    body: JSON.stringify({
      invoice_code: invoiceCode,
      sender_invoice_no: input.senderInvoiceNo,
      invoice_receiver_code: "terminal",
      invoice_description: input.description,
      amount: input.amountMnt,
      callback_url: callbackUrl,
    }),
  });
}

export async function checkQPayInvoicePayment(
  invoiceId: string,
): Promise<QPayPaymentCheckResponse> {
  return qpayFetch<QPayPaymentCheckResponse>("/v2/payment/check", {
    method: "POST",
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 10 },
    }),
  });
}

export function isInvoicePaid(result: QPayPaymentCheckResponse): boolean {
  return (
    result.count > 0 &&
    result.rows.some((row) => row.payment_status === "PAID")
  );
}
