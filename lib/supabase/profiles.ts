import { createSupabaseBrowserClient } from "./client";

export type UserProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
};

export async function fetchUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    console.warn("[supabase] fetchUserProfile:", error?.message);
    return null;
  }

  return data as UserProfile;
}

export async function ensureUserProfile(
  userId: string,
  fullName: string,
  phone: string,
): Promise<UserProfile | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      { id: userId, full_name: fullName, phone, role: "customer" },
      { onConflict: "id" },
    )
    .select("id, full_name, phone, role")
    .single();

  if (error) {
    console.warn("[supabase] ensureUserProfile:", error.message);
    return null;
  }

  return data as UserProfile;
}
