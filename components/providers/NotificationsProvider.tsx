"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppNotification = {
  id: string;
  title: string;
  body?: string;
  createdAt: number;
  read: boolean;
};

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
  push: (n: Omit<AppNotification, "id" | "createdAt">) => void;
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
  {
    id: "hours",
    title: "Ажиллах цаг",
    body: "Өдөр бүр 10:00–22:00",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
  },
];

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>(seed);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      const list = parsed
        .filter(Boolean)
        .map((x: any) => ({
          id: String(x.id ?? uid()),
          title: String(x.title ?? ""),
          body: x.body ? String(x.body) : undefined,
          createdAt: Number(x.createdAt ?? Date.now()),
          read: Boolean(x.read),
        }))
        .filter((x: AppNotification) => x.title.length > 0);
      if (list.length) setNotifications(list);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.reduce((s, n) => s + (n.read ? 0 : 1), 0),
    [notifications],
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clear = useCallback(() => setNotifications([]), []);

  const push = useCallback(
    (n: Omit<AppNotification, "id" | "createdAt">) => {
      setNotifications((prev) => [
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
    [],
  );

  const value = useMemo<NotificationsContextValue>(() => {
    return {
      notifications,
      unreadCount,
      markRead,
      markAllRead,
      clear,
      push,
    };
  }, [notifications, unreadCount, markRead, markAllRead, clear, push]);

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

