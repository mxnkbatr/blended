import { NextResponse } from "next/server";
import { isQPayConfigured } from "@/lib/qpay/config";
import {
  createShopOrderServer,
  getOrderPaymentState,
  markOrderPaidByQPayInvoice,
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

    const checkoutLines = lines.map((line) => ({
      slug: line.slug,
      name: line.name,
      priceMnt: line.priceMnt,
      qty: line.qty,
      imageUrl: line.imageUrl,
    }));

    const totalMnt = checkoutLines.reduce(
      (sum, line) => sum + line.priceMnt * line.qty,
      0,
    );

    if (totalMnt <= 0) {
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
      });

      if (!orderResult.ok) {
        return NextResponse.json({ error: orderResult.error }, { status: 500 });
      }

      return NextResponse.json({
        orderId: orderResult.orderId,
        paymentRef: senderInvoiceNo,
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
    });

    if (!orderResult.ok) {
      return NextResponse.json({ error: orderResult.error }, { status: 500 });
    }

    return NextResponse.json({
      orderId: orderResult.orderId,
      paymentRef: `ACHIRA-${orderResult.orderId.slice(0, 8).toUpperCase()}`,
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
      await markOrderPaidByQPayInvoice(order.qpay_invoice_id);
      return NextResponse.json({ paid: true, status: "PAID" });
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
