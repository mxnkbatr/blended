import { createSupabaseBrowserClient } from "./client";

export type UserAppointment = {
  id: string;
  barber_id: string;
  customer_name: string;
  customer_phone: string;
  starts_at: string;
  ends_at: string;
  status: string;
  created_at: string;
};

export async function fetchUserAppointmentsByPhone(
  phone: string,
): Promise<UserAppointment[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const localPhone = phone.trim();
  if (!localPhone) return [];

  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id, barber_id, customer_name, customer_phone, starts_at, ends_at, status, created_at",
    )
    .eq("customer_phone", localPhone)
    .order("starts_at", { ascending: false })
    .limit(20);

  if (error || !data) {
    console.warn("[supabase] fetchUserAppointmentsByPhone:", error?.message);
    return [];
  }

  return data as UserAppointment[];
}

