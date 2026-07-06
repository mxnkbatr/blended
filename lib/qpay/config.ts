export function getQPayConfig() {
  const baseUrl =
    process.env.QPAY_API_BASE_URL?.replace(/\/$/, "") ??
    "https://merchant.qpay.mn";

  const invoiceCode = process.env.QPAY_INVOICE_CODE;
  const clientName = process.env.QPAY_CLIENT_NAME;
  const password = process.env.QPAY_PASSWORD;

  if (!invoiceCode || !clientName || !password) {
    throw new Error(
      "QPay тохиргоо дутуу: QPAY_INVOICE_CODE, QPAY_CLIENT_NAME, QPAY_PASSWORD.",
    );
  }

  const authUrl =
    process.env.QPAY_AUTH_URL?.replace(/\/$/, "") ?? `${baseUrl}/v2/auth/token`;

  const callbackUrl =
    process.env.QPAY_CALLBACK_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/qpay/callback/`
      : null);

  if (!callbackUrl) {
    throw new Error(
      "QPAY_CALLBACK_URL тохируулна уу (жишээ: https://yourdomain.com/api/qpay/callback/).",
    );
  }

  return {
    baseUrl,
    authUrl,
    invoiceCode,
    clientName,
    password,
    callbackUrl: callbackUrl.endsWith("/") ? callbackUrl : `${callbackUrl}/`,
    merchantName: process.env.QPAY_MERCHANT_NAME ?? "ACHIRA ARTIST",
  };
}

export function isQPayConfigured(): boolean {
  try {
    getQPayConfig();
    return true;
  } catch {
    return false;
  }
}
