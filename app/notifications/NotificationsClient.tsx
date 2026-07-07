"use client";

import { useEffect } from "react";
import { Check, CheckCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useNotifications } from "@/components/providers/NotificationsProvider";

function formatTime(ts: number) {
  try {
    return new Intl.DateTimeFormat("mn-MN", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return "";
  }
}

export function NotificationsClient() {
  const { user } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead, clear, refresh } =
    useNotifications();

  useEffect(() => {
    if (user) void refresh();
  }, [user, refresh]);

  return (
    <main className="mx-auto max-w-md px-4 py-10 md:max-w-2xl md:py-14">
      <p className="text-[10px] uppercase tracking-[0.32em] text-achira-blue/55 dark:text-achira-cream/50">
        Notifications
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream sm:text-3xl">
        Мэдэгдэл
      </h1>
      <p className="mt-3 text-sm text-achira-blue/65 dark:text-achira-cream/60">
        Уншаагүй:{" "}
        <span className="font-semibold text-achira-blue-dark dark:text-achira-cream">
          {unreadCount}
        </span>
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={markAllRead}
          className="inline-flex items-center gap-2 rounded-2xl border border-achira-blue/12 bg-achira-paper/60 px-3 py-2 text-[11px] font-semibold text-achira-blue-dark transition-colors hover:border-achira-blue/25 hover:bg-achira-paper active:scale-[0.99] dark:border-achira-cream/12 dark:bg-achira-blue/10 dark:text-achira-cream dark:hover:border-achira-cream/25"
        >
          <CheckCheck className="h-4 w-4" strokeWidth={1.35} />
          Бүгдийг уншсан
        </button>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-2 rounded-2xl border border-achira-blue/12 bg-white/60 px-3 py-2 text-[11px] font-semibold text-achira-blue/70 transition-colors hover:border-achira-blue/25 active:scale-[0.99] dark:border-achira-cream/12 dark:bg-achira-navy/40 dark:text-achira-cream/80 dark:hover:border-achira-cream/25"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.35} />
          Цэвэрлэх
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-achira-blue/10 bg-achira-paper/50 p-6 dark:border-achira-cream/10 dark:bg-achira-blue/10">
          <p className="text-sm text-achira-blue/55 dark:text-achira-cream/50">
            Одоогоор мэдэгдэл алга.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markRead(n.id)}
              className={`w-full rounded-3xl border p-4 text-left transition-colors active:scale-[0.99] ${
                n.read
                  ? "border-achira-blue/10 bg-white/60 dark:border-achira-cream/10 dark:bg-achira-navy/40"
                  : "border-achira-blue/20 bg-achira-paper/70 shadow-[0_8px_24px_rgba(30,79,150,0.08)] dark:border-achira-cream/15 dark:bg-achira-blue/15 dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
              }`}
              aria-label={n.read ? "Уншсан" : "Уншсан болгох"}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-achira-blue-dark dark:text-achira-cream">
                    {n.title}
                  </p>
                  {n.body ? (
                    <p className="mt-1 line-clamp-2 text-sm text-achira-blue/70 dark:text-achira-cream/65">
                      {n.body}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[11px] text-achira-blue/50 dark:text-achira-cream/45">
                    {formatTime(n.createdAt)}
                  </p>
                </div>
                {!n.read ? (
                  <span className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-achira-blue px-2 py-1 text-[10px] font-bold text-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark">
                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                    NEW
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
