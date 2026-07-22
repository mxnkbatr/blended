"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  fetchUserNotifications,
  markAllUserNotificationsRead,
  markUserNotificationRead,
  type InboxNotification,
} from "@/lib/supabase/notifications";
import { useVisibilityRefresh } from "@/hooks/useVisibilityRefresh";

export type AppNotification = {
  id: string;
  title: string;
  body?: string;
  createdAt: number;
  read: boolean;
  remote?: boolean;
};

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
  push: (n: Omit<AppNotification, "id" | "createdAt">) => void;
  refresh: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

const STORAGE_KEY = "blended:notifications:v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

const seed: AppNotification[] = [
  {
    id: "welcome",
    title: "Achira Artist-д тавтай морил",
    body: "Шинэ бүтээгдэхүүнүүдээ дэлгүүрээс үзээрэй.",
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    read: false,
  },
];

function mapRemote(row: InboxNotification): AppNotification {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.createdAt,
    read: row.read,
    remote: true,
  };
}

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [localNotifications, setLocalNotifications] =
    useState<AppNotification[]>(seed);
  const [remoteNotifications, setRemoteNotifications] = useState<
    AppNotification[]
  >([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setRemoteNotifications([]);
      return;
    }
    const rows = await fetchUserNotifications(user.id);
    setRemoteNotifications(rows.map(mapRemote));
  }, [user]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      const list = parsed
        .filter(Boolean)
        .map((x: AppNotification) => ({
          id: String(x.id ?? uid()),
          title: String(x.title ?? ""),
          body: x.body ? String(x.body) : undefined,
          createdAt: Number(x.createdAt ?? Date.now()),
          read: Boolean(x.read),
        }))
        .filter((x) => x.title.length > 0);
      if (list.length) setLocalNotifications(list);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useVisibilityRefresh(() => {
    void refresh();
  });

  useEffect(() => {
    const onRefresh = () => {
      void refresh();
    };
    window.addEventListener("achira:notifications-refresh", onRefresh);
    return () => {
      window.removeEventListener("achira:notifications-refresh", onRefresh);
    };
  }, [refresh]);

  useEffect(() => {
    if (user) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localNotifications));
    } catch {
      // ignore
    }
  }, [localNotifications, user]);

  const notifications = useMemo(() => {
    if (user) return remoteNotifications;
    return localNotifications;
  }, [user, remoteNotifications, localNotifications]);

  const unreadCount = useMemo(
    () => notifications.reduce((s, n) => s + (n.read ? 0 : 1), 0),
    [notifications],
  );

  const markRead = useCallback(
    (id: string) => {
      if (user) {
        setRemoteNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        void markUserNotificationRead(id);
        return;
      }
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    },
    [user],
  );

  const markAllRead = useCallback(() => {
    if (user) {
      setRemoteNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      if (user.id) void markAllUserNotificationsRead(user.id);
      return;
    }
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [user]);

  const clear = useCallback(() => {
    if (user) setRemoteNotifications([]);
    else setLocalNotifications([]);
  }, [user]);

  const push = useCallback(
    (n: Omit<AppNotification, "id" | "createdAt">) => {
      if (user) return;
      setLocalNotifications((prev) => [
        {
          id: uid(),
          createdAt: Date.now(),
          title: n.title,
          body: n.body,
          read: n.read ?? false,
        },
        ...prev,
      ]);
    },
    [user],
  );

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      markRead,
      markAllRead,
      clear,
      push,
      refresh,
    }),
    [notifications, unreadCount, markRead, markAllRead, clear, push, refresh],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationsProvider",
    );
  return ctx;
}
