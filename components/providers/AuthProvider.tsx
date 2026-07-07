"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getApiBase } from "@/lib/api-base";
import { phoneToAuthEmail } from "@/lib/auth/phone";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ensureUserProfile,
  fetchUserProfile,
  syncBootstrapAdminRole,
  type UserProfile,
} from "@/lib/supabase/profiles";

type AuthResult = {
  error: string | null;
  sessionCreated?: boolean;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (phone: string, password: string) => Promise<AuthResult>;
  signUp: (
    phone: string,
    password: string,
    name: string,
    code: string,
  ) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid") || m.includes("credentials")) {
    return "Утас эсвэл нууц үг буруу байна.";
  }
  if (m.includes("rate limit")) {
    return "Хэт олон оролдлого. Түр хүлээгээд дахин оролдоно уу.";
  }
  return message;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }

    let p = await fetchUserProfile(nextUser.id);
    if (!p) {
      const name =
        (nextUser.user_metadata?.full_name as string | undefined) ?? "";
      const phone =
        (nextUser.user_metadata?.phone as string | undefined) ?? "";
      p = await ensureUserProfile(nextUser.id, name, phone);
    }
    if (p) {
      p = await syncBootstrapAdminRole(p);
    }
    setProfile(p);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user);
  }, [loadProfile, user]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      const nextUser = data.session?.user ?? null;
      setSession(data.session);
      setUser(nextUser);
      void loadProfile(nextUser).finally(() => setLoading(false));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      const nextUser = next?.user ?? null;
      setSession(next);
      setUser(nextUser);
      void loadProfile(nextUser);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = useCallback(async (phone: string, password: string) => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return { error: "Supabase тохиргоо хийгдээгүй." };

    let email: string;
    try {
      email = phoneToAuthEmail(phone);
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Утасны дугаар буруу байна.",
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: mapAuthError(error.message) };

    if (data.user) await loadProfile(data.user);
    return { error: null, sessionCreated: !!data.session };
  }, [loadProfile]);

  const signUp = useCallback(
    async (phone: string, password: string, name: string, code: string) => {
      try {
        const res = await fetch(`${getApiBase()}/api/auth/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password, name, code }),
        });
        const data = (await res.json()) as { error?: string };

        if (!res.ok) {
          return { error: data.error ?? "Бүртгэл амжилтгүй боллоо." };
        }

        return signIn(phone, password);
      } catch {
        return { error: "Серверт холбогдож чадсангүй. npm run dev ажиллаж байгаа эсэхийг шалгана уу." };
      }
    },
    [signIn],
  );

  const signOut = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const isAdmin = profile?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      isAdmin,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      isAdmin,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
