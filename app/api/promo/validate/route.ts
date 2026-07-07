import { NextResponse } from "next/server";
import { validateShopPromo } from "@/lib/promo/server";
import type { CartLine } from "@/components/providers/CartProvider";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      code?: string;
      lines?: CartLine[];
    };

    const code = body.code?.trim();
    const lines = body.lines ?? [];

    if (!code) {
      return NextResponse.json({ error: "Промо код оруулна уу." }, { status: 400 });
    }

    const result = await validateShopPromo(
      code,
      lines.map((line) => ({
        slug: line.slug,
        priceMnt: line.priceMnt,
        qty: line.qty,
      })),
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      code: result.promo.code,
      discountPercent: result.promo.discount_percent,
      subtotalMnt: result.subtotalMnt,
      discountMnt: result.discountMnt,
      totalMnt: result.totalMnt,
    });
  } catch (err) {
    console.error("[promo/validate]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Алдаа гарлаа." },
      { status: 500 },
    );
  }
}
