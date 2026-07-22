import { NextResponse } from "next/server";
import { isQPayConfigured } from "@/lib/qpay/config";
import { validateCartStock, resolveCartLines } from "@/lib/products/stock";
import { validateShopPromo } from "@/lib/promo/server";
import {
  createShopOrderServer,
  finalizeOrderPayment,
  getOrderPaymentState,
} from "@/lib/qpay/orders";
import {
  checkQPayInvoicePayment,
  createQPayInvoice,
  isInvoicePaid,
} from "@/lib/qpay/server";
import type { CartLine } from "@/components/providers/CartProvider";

type CheckoutBody = {
  lines?: CartLine[];
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: "qpay" | "socialpay";
  userId?: string | null;
  promoCode?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const lines = body.lines ?? [];
    const customerName = body.customerName?.trim();
    const customerPhone = body.customerPhone?.trim();
    const paymentMethod = body.paymentMethod ?? "qpay";

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Нэр, утасны дугаар заавал." },
        { status: 400 },
      );
    }

    if (lines.length === 0) {
      return NextResponse.json({ error: "Сагс хоосон байна." }, { status: 400 });
    }

    const stockCheck = await validateCartStock(lines);
    if (!stockCheck.ok) {
      return NextResponse.json({ error: stockCheck.error }, { status: 400 });
    }

    const resolved = await resolveCartLines(lines);
    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: 400 });
    }

    const checkoutLines = resolved.lines;
    const subtotalMnt = resolved.subtotalMnt;

    let discountMnt = 0;
    let totalMnt = subtotalMnt;
    let promoId: string | null = null;
    let promoCode: string | null = null;

    if (body.promoCode?.trim()) {
      const promoResult = await validateShopPromo(
        body.promoCode,
        checkoutLines,
      );
      if (!promoResult.ok) {
        return NextResponse.json({ error: promoResult.error }, { status: 400 });
      }
      discountMnt = promoResult.discountMnt;
      totalMnt = promoResult.totalMnt;
      promoId = promoResult.promo.id;
      promoCode = promoResult.promo.code;
    }

    if (totalMnt <= 0 && subtotalMnt <= 0) {
      return NextResponse.json({ error: "Буруу дүн." }, { status: 400 });
    }

    if (paymentMethod === "qpay") {
      if (!isQPayConfigured()) {
        return NextResponse.json(
          { error: "QPay тохиргоо хийгдээгүй." },
          { status: 503 },
        );
      }

      const senderInvoiceNo = `ACHIRA-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
      const description = `ACHIRA ARTIST — ${customerName} (${checkoutLines.length} бүтээгдэхүүн)`;

      const invoice = await createQPayInvoice({
        senderInvoiceNo,
        description,
        amountMnt: totalMnt,
      });

      const orderResult = await createShopOrderServer({
        lines: checkoutLines,
        customerName,
        customerPhone,
        paymentMethod,
        userId: body.userId ?? null,
        qpayInvoiceId: invoice.invoice_id,
        qpaySenderInvoiceNo: senderInvoiceNo,
        subtotalMnt,
        discountMnt,
        promoCode,
        promoId,
      });

      if (!orderResult.ok) {
        return NextResponse.json({ error: orderResult.error }, { status: 500 });
      }

      return NextResponse.json({
        orderId: orderResult.orderId,
        paymentRef: senderInvoiceNo,
        subtotalMnt,
        discountMnt,
        totalMnt,
        qpay: {
          invoiceId: invoice.invoice_id,
          qrText: invoice.qr_text ?? null,
          qrImage: invoice.qr_image ?? null,
          shortUrl: invoice.qPay_shortUrl ?? null,
          urls: invoice.urls ?? [],
        },
      });
    }

    const orderResult = await createShopOrderServer({
      lines: checkoutLines,
      customerName,
      customerPhone,
      paymentMethod,
      userId: body.userId ?? null,
      subtotalMnt,
      discountMnt,
      promoCode,
      promoId,
    });

    if (!orderResult.ok) {
      return NextResponse.json({ error: orderResult.error }, { status: 500 });
    }

    return NextResponse.json({
      orderId: orderResult.orderId,
      paymentRef: `ACHIRA-${orderResult.orderId.slice(0, 8).toUpperCase()}`,
      subtotalMnt,
      discountMnt,
      totalMnt,
    });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Серверийн алдаа." },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const orderId = new URL(req.url).searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "orderId шаардлагатай." }, { status: 400 });
  }

  try {
    const order = await getOrderPaymentState(orderId);
    if (!order) {
      return NextResponse.json({ error: "Захиалга олдсонгүй." }, { status: 404 });
    }

    if (order.status === "PAID") {
      return NextResponse.json({ paid: true, status: order.status });
    }

    if (!order.qpay_invoice_id || !isQPayConfigured()) {
      return NextResponse.json({ paid: false, status: order.status });
    }

    const check = await checkQPayInvoicePayment(order.qpay_invoice_id);
    if (isInvoicePaid(check)) {
      const result = await finalizeOrderPayment({
        invoiceId: order.qpay_invoice_id,
      });
      return NextResponse.json({
        paid: true,
        status: "PAID",
        smsSent: result.smsSent ?? false,
      });
    }

    return NextResponse.json({ paid: false, status: order.status });
  } catch (err) {
    console.error("[checkout/check]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Шалгахад алдаа." },
      { status: 500 },
    );
  }
}
