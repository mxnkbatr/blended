"use client";

import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiUrl } from "@/lib/api-base";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export function BarberImageUpload({ value, onChange }: Props) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data } = supabase ? await supabase.auth.getSession() : { data: null };
      const accessToken = data?.session?.access_token;

      if (!user || !accessToken) {
        setError("Зураг оруулахын тулд admin эрхтэй нэвтэрнэ үү.");
        return;
      }

      const body = new FormData();
      body.append("file", file);

      const res = await fetch(apiUrl("/api/admin/upload-barber-image/"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      });
      const payload = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !payload.url) {
        setError(payload.error ?? "Зураг оруулахад алдаа гарлаа.");
        return;
      }

      onChange(payload.url);
    } catch {
      setError("Серверт холбогдож чадсангүй.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-upload">
      <p className="admin-label">Зураг</p>
      <div className="mt-2 flex items-start gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="admin-upload-trigger"
        >
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-achira-blue/50 dark:text-achira-cream/45">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Camera className="h-6 w-6" strokeWidth={1.5} />
              )}
              <span className="text-[11px]">Зураг сонгох</span>
            </div>
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="admin-btn-secondary w-full sm:w-auto"
          >
            {uploading ? "Оруулж байна..." : value ? "Зураг солих" : "Гар утаснаас оруулах"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400"
            >
              <X className="h-3.5 w-3.5" />
              Зураг устгах
            </button>
          )}
          <p className="text-xs leading-relaxed text-achira-blue/50 dark:text-achira-cream/45">
            JPG, PNG, WEBP. Хамгийн ихдээ 5MB.
          </p>
          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
