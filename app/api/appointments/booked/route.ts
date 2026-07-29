import { NextResponse } from "next/server";
import {
  reconcileAppointmentsForBarberDay,
} from "@/lib/appointments/payment";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function formatAppointmentSlot(iso: string): string {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ulaanbaatar",
    hour: "2-digit",
    hour12: false,
  }).format(new Date(iso));
  return `${hour}:00`;
}

/** Барберын өдрийн цагууд — QPay төлбөрийг шинэчлээд буцаана */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const barberId = searchParams.get("barberId")?.trim();
  const date = searchParams.get("date")?.trim();

  if (!barberId || !date) {
    return NextResponse.json(
      { error: "barberId, date шаардлагатай." },
      { status: 400 },
    );
  }

  try {
    await reconcileAppointmentsForBarberDay(barberId, date);

    const supabase = createSupabaseAdminClient();
    const dayStart = `${date}T00:00:00+08:00`;
    const dayEnd = `${date}T23:59:59.999+08:00`;

    const { data, error } = await supabase
      .from("appointments")
      .select("starts_at, status, customer_name")
      .eq("barber_id", barberId)
      .gte("starts_at", dayStart)
      .lte("starts_at", dayEnd)
      .neq("status", "CANCELLED")
      .order("starts_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const slots = (data ?? []).map((row) => ({
      time: formatAppointmentSlot(row.starts_at),
      customerName: (row.customer_name as string)?.trim() || "Захиалагдсан",
      status: row.status as string,
    }));

    return NextResponse.json({ slots });
  } catch (err) {
    console.error("[appointments/booked]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Алдаа" },
      { status: 500 },
    );
  }
}
