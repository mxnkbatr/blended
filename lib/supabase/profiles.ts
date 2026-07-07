import { createSupabaseBrowserClient } from "./client";
import { isBootstrapAdminPhone } from "@/lib/auth/bootstrap-admins";

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

  const role = isBootstrapAdminPhone(phone) ? "admin" : "customer";

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      { id: userId, full_name: fullName, phone, role },
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

export async function syncBootstrapAdminRole(
  profile: UserProfile,
): Promise<UserProfile> {
  if (
    profile.role === "admin" ||
    !profile.phone ||
    !isBootstrapAdminPhone(profile.phone)
  ) {
    return profile;
  }

  const supabase = createSupabaseBrowserClient();
  if (!supabase) return profile;

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: "admin", updated_at: new Date().toISOString() })
    .eq("id", profile.id)
    .select("id, full_name, phone, role")
    .single();

  if (error || !data) {
    console.warn("[supabase] syncBootstrapAdminRole:", error?.message);
    return profile;
  }

  return data as UserProfile;
}
