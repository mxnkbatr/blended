import { createSupabaseBrowserClient } from "./client";

export type InboxNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
};

export async function fetchUserNotifications(
  userId: string,
): Promise<InboxNotification[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("user_notifications")
    .select(
      "id, read_at, created_at, app_notifications ( title, body, created_at )",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    console.warn("[supabase] fetchUserNotifications:", error?.message);
    return [];
  }

  return data
    .map((row) => {
      const note = row.app_notifications as
        | { title: string; body: string; created_at: string }
        | { title: string; body: string; created_at: string }[]
        | null;
      const payload = Array.isArray(note) ? note[0] : note;
      if (!payload) return null;
      return {
        id: row.id as string,
        title: payload.title,
        body: payload.body,
        createdAt: new Date(payload.created_at ?? row.created_at).getTime(),
        read: Boolean(row.read_at),
      };
    })
    .filter((row): row is InboxNotification => row !== null);
}

export async function markUserNotificationRead(
  inboxId: string,
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return;

  await supabase
    .from("user_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", inboxId);
}

export async function markAllUserNotificationsRead(
  userId: string,
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return;

  await supabase
    .from("user_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);
}
