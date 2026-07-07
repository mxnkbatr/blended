import { config } from "dotenv";
import { getQPayConfig, isQPayConfigured } from "@/lib/qpay/config";
import { createQPayInvoice, getQPayAccessToken } from "@/lib/qpay/server";

config({ path: ".env.local" });
config();

async function main() {
  console.log("QPay configured:", isQPayConfigured());
  const cfg = getQPayConfig();
  console.log("Merchant:", cfg.merchantName);
  console.log("Invoice code:", cfg.invoiceCode);
  console.log("Callback:", cfg.callbackUrl);

  const token = await getQPayAccessToken();
  console.log("Auth OK, token prefix:", token.slice(0, 24) + "...");

  const inv = await createQPayInvoice({
    senderInvoiceNo: `TEST-${Date.now()}`,
    description: "ACHIRA ARTIST — connection test",
    amountMnt: 100,
  });

  console.log("Invoice ID:", inv.invoice_id);
  console.log("QR ready:", Boolean(inv.qr_image || inv.qr_text));
  console.log("Bank links:", inv.urls?.length ?? 0);
}

main().catch((err) => {
  console.error("QPay test failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
