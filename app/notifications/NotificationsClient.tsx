"use client";

import { Check, CheckCheck, Trash2 } from "lucide-react";
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
  const { notifications, unreadCount, markRead, markAllRead, clear } =
    useNotifications();

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-600">
        Notifications
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] text-white">
        Мэдэгдэл
      </h1>
      <p className="mt-3 text-sm text-zinc-500">
        Уншаагүй: <span className="text-white">{unreadCount}</span>
      </p>

      <div className="mt-6 flex items-center gap-2">
        <button
          type="button"
          onClick={markAllRead}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold text-white/90 hover:bg-white/[0.06] active:scale-[0.99]"
        >
          <CheckCheck className="h-4 w-4" strokeWidth={1.35} />
          Бүгдийг уншсан
        </button>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold text-white/90 hover:bg-white/[0.06] active:scale-[0.99]"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.35} />
          Цэвэрлэх
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-zinc-500">Одоогоор мэдэгдэл алга.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markRead(n.id)}
              className={`w-full rounded-3xl border p-4 text-left backdrop-blur-md transition-colors active:scale-[0.99] ${
                n.read
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-white/20 bg-white/[0.06]"
              }`}
              aria-label={n.read ? "Уншсан" : "Уншсан болгох"}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-white">
                    {n.title}
                  </p>
                  {n.body ? (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                      {n.body}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[11px] text-zinc-500">
                    {formatTime(n.createdAt)}
                  </p>
                </div>
                {!n.read ? (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-black">
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

