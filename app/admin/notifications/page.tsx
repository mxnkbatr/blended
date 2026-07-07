"use client";

import { useCallback, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  adminFetchNotifications,
  type AdminNotificationRow,
} from "@/lib/supabase/admin-crud";
import { apiUrl } from "@/lib/api-base";
import { hapticSuccess } from "@/lib/haptics";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ulaanbaatar",
  }).format(new Date(iso));
}

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AdminNotificationRow[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setHistory(await adminFetchNotifications());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || sending) return;

    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(apiUrl("/api/admin/notifications/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          createdBy: user?.id ?? null,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        recipientCount?: number;
        pushSent?: number;
      };

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Илгээхэд алдаа гарлаа.");
        return;
      }

      setTitle("");
      setBody("");
      setSuccess(
        `${data.recipientCount ?? 0} хэрэглэгчийн inbox-д хадгаллаа` +
          (data.pushSent ? `, ${data.pushSent} push илгээгдлээ.` : "."),
      );
      await hapticSuccess();
      await load();
    } catch {
      setError("Сүлжээний алдаа.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Мэдэгдэл"
        description="Гар утаснаасаа бичиж, бүх хэрэглэгчид апп дээр харагдуулна."
      />

      <AdminFeedback success={success} error={error} className="mt-4" />

      <form onSubmit={handleSend} className="mt-5 space-y-4">
        <label className="block">
          <span className="admin-label">Гарчиг</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="admin-input mt-1.5"
            placeholder="Жишээ: Шинэ бүтээгдэхүүн"
          />
        </label>
        <label className="block">
          <span className="admin-label">Мэдэгдлийн текст</span>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="admin-input mt-1.5 resize-none"
            placeholder="Хэрэглэгчид харагдах мессеж..."
          />
        </label>
        <button
          type="submit"
          disabled={sending}
          className="admin-btn-primary inline-flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {sending ? "Илгээж байна..." : "Бүх хэрэглэгчид илгээх"}
        </button>
      </form>

      <div className="mt-8 border-t border-achira-blue/8 pt-6 dark:border-achira-cream/8">
        <p className="admin-label">Сүүлд илгээсэн</p>
        {loading ? (
          <div className="mt-4 h-20 animate-pulse rounded-2xl bg-achira-blue/5" />
        ) : history.length === 0 ? (
          <p className="mt-3 text-sm text-achira-blue/55 dark:text-achira-cream/50">
            Одоогоор мэдэгдэл илгээгдээгүй.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {history.map((item) => (
              <li key={item.id} className="admin-list-item !items-start">
                <div>
                  <p className="font-medium text-achira-blue-dark dark:text-achira-cream">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-achira-blue/60 dark:text-achira-cream/55">
                    {item.body}
                  </p>
                  <p className="mt-2 text-xs text-achira-blue/45 dark:text-achira-cream/40">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
