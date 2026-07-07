import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const MAX_TOKENS_PER_USER = 8;

export function isFcmRegistrationToken(token: string): boolean {
  return token.includes(":") && token.length > 80;
}

export async function registerPushToken(input: {
  userId: string;
  token: string;
  platform: string;
}): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  const { error } = await supabase.from("push_tokens").upsert(
    {
      user_id: input.userId,
      token: input.token,
      platform: input.platform,
      updated_at: now,
    },
    { onConflict: "user_id,token" },
  );

  if (error) throw new Error(error.message);

  const { data: rows, error: listError } = await supabase
    .from("push_tokens")
    .select("id, token, updated_at")
    .eq("user_id", input.userId)
    .order("updated_at", { ascending: false });

  if (listError || !rows || rows.length <= MAX_TOKENS_PER_USER) return;

  const removeIds = rows.slice(MAX_TOKENS_PER_USER).map((r) => r.id);
  await supabase.from("push_tokens").delete().in("id", removeIds);
}

export async function fetchAllValidFcmTokens(): Promise<string[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("push_tokens")
    .select("token");

  if (error || !data) return [];

  const tokenSet = new Set<string>();
  for (const row of data) {
    if (row.token && isFcmRegistrationToken(row.token)) {
      tokenSet.add(row.token);
    }
  }
  return [...tokenSet];
}

export async function removeInvalidPushTokens(tokens: string[]): Promise<void> {
  if (tokens.length === 0) return;
  const supabase = createSupabaseAdminClient();
  await supabase.from("push_tokens").delete().in("token", tokens);
}
