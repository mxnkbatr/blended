import { NextResponse } from "next/server";
import { reconcileAllAwaitingPayments } from "@/lib/appointments/payment";

/** QPay төлсөн ч AWAITING_PAYMENT үлдсэн захиалгуудыг засна */
export async function POST() {
  try {
    const result = await reconcileAllAwaitingPayments(60);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[appointments/reconcile]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Алдаа" },
      { status: 500 },
    );
  }
}
