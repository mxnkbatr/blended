export type QPayTokenResponse = {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
};

export type QPayInvoiceResponse = {
  invoice_id: string;
  qr_text?: string;
  qr_image?: string;
  qPay_shortUrl?: string;
  urls?: {
    name: string;
    description: string;
    logo: string;
    link: string;
  }[];
};

export type QPayPaymentCheckResponse = {
  count: number;
  paid_amount: number;
  rows: {
    payment_id: string;
    payment_status: string;
    payment_amount: string;
  }[];
};
