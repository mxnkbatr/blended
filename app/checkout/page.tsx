"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { createShopOrder } from "@/lib/supabase/orders";
import { hapticLight, hapticSuccess } from "@/lib/haptics";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

type PayTab = "qpay" | "socialpay";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { lines, setQty, removeLine, totalMnt, clear, hydrated } = useCart();
  const [tab, setTab] = useState<PayTab>("qpay");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24">
        <div className="h-40 animate-pulse rounded-2xl bg-achira-blue/5" />
      </main>
    );
  }

  if (orderId) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-achira-blue/15 bg-achira-blue/8 text-achira-blue dark:border-achira-cream/15 dark:bg-achira-cream/10 dark:text-achira-cream">
          <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl text-achira-blue-dark dark:text-achira-cream">
          Захиалга баталгаажлаа
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
          {tab === "qpay" ? "QPay" : "SocialPay"} QR-аар төлбөрөө хийнэ үү.
          Баталгаажуулалтын дараа бүтээгдэхүүн бэлдэнэ.
        </p>
        {paymentRef && (
          <p className="mt-4 rounded-2xl border border-achira-blue/12 bg-achira-paper/60 px-4 py-3 font-mono text-sm text-achira-blue-dark dark:border-achira-cream/10 dark:bg-achira-blue/10 dark:text-achira-cream">
            {paymentRef}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/profile"
            className="inline-flex justify-center rounded-2xl bg-achira-blue py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
          >
            Профайл руу
          </Link>
          <Link
            href="/shop"
            className="text-sm text-achira-blue/60 underline-offset-4 hover:underline dark:text-achira-cream/55"
          >
            Дэлгүүр үргэлжлүүлэх
          </Link>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-achira-blue-dark dark:text-achira-cream">
          Сагс хоосон байна
        </h1>
        <p className="mt-4 text-sm text-achira-blue/60 dark:text-achira-cream/55">
          Дэлгүүрээс бүтээгдэхүүн сонгон сагсандаа нэмнэ үү.
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-flex rounded-full bg-achira-blue px-8 py-3 text-sm font-semibold uppercase tracking-widest text-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
        >
          Дэлгүүр рүү
        </Link>
      </main>
    );
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || submitting) return;

    setSubmitting(true);
    setError(null);
    await hapticLight();

    const result = await createShopOrder({
      lines,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      paymentMethod: tab,
      userId: user?.id ?? null,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    await hapticSuccess();
    setOrderId(result.orderId);
    setPaymentRef(`ACHIRA-${result.orderId.slice(0, 8).toUpperCase()}`);
    clear();
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-achira-blue-dark dark:text-achira-cream sm:text-4xl">
        Төлбөр
      </h1>
      <p className="mt-2 text-sm text-achira-blue/60 dark:text-achira-cream/55">
        Сагсаа шалгаад QPay эсвэл SocialPay-ээр төлнө үү.
      </p>

      <form
        onSubmit={handlePay}
        className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
      >
        <section className="rounded-3xl border border-achira-blue/10 bg-achira-paper/50 p-5 dark:border-achira-cream/10 dark:bg-achira-blue/8">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-achira-blue/55 dark:text-achira-cream/50">
            Сагс
          </h2>
          <ul className="mt-4 divide-y divide-achira-blue/10 dark:divide-achira-cream/10">
            {lines.map((line) => (
              <li key={line.slug} className="flex gap-4 py-4 first:pt-0">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-achira-blue/10">
                  <Image
                    src={line.imageUrl}
                    alt={line.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-achira-blue-dark dark:text-achira-cream">
                    {line.name}
                  </p>
                  <p className="mt-1 text-sm text-achira-blue/55 dark:text-achira-cream/50">
                    {formatMnt(line.priceMnt)} × {line.qty}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={line.qty}
                      onChange={(e) =>
                        setQty(line.slug, Number.parseInt(e.target.value, 10) || 1)
                      }
                      className="w-16 rounded-xl border border-achira-blue/12 bg-white/80 px-2 py-1 text-center text-sm dark:border-achira-cream/12 dark:bg-achira-navy/50 dark:text-achira-cream"
                    />
                    <button
                      type="button"
                      onClick={() => removeLine(line.slug)}
                      className="text-xs uppercase tracking-wider text-achira-burgundy/80"
                    >
                      Хасах
                    </button>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-semibold text-achira-blue dark:text-achira-cream">
                  {formatMnt(line.priceMnt * line.qty)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-achira-blue/10 pt-4 dark:border-achira-cream/10">
            <span className="text-sm text-achira-blue/60 dark:text-achira-cream/55">Нийт</span>
            <span className="text-lg font-semibold text-achira-blue-dark dark:text-achira-cream">
              {formatMnt(totalMnt)}
            </span>
          </div>
        </section>

        <section className="rounded-3xl border border-achira-blue/10 bg-white/70 p-5 dark:border-achira-cream/10 dark:bg-achira-navy/40 sm:p-6">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-achira-blue/55 dark:text-achira-cream/50">
            Холбоо барих
          </h2>
          <div className="mt-4 space-y-3">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Таны нэр"
              className="w-full rounded-2xl border border-achira-blue/12 bg-achira-cream/50 px-4 py-3 text-base outline-none dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
            />
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Утасны дугаар"
              className="w-full rounded-2xl border border-achira-blue/12 bg-achira-cream/50 px-4 py-3 text-base outline-none dark:border-achira-cream/12 dark:bg-achira-navy/60 dark:text-achira-cream"
            />
          </div>

          {!user && (
            <p className="mt-3 text-xs text-achira-blue/55 dark:text-achira-cream/50">
              <Link href="/login" className="underline underline-offset-2">
                Нэвтэрснээр
              </Link>{" "}
              захиалгын түүх хадгалагдана.
            </p>
          )}

          <h2 className="mt-6 text-[10px] font-medium uppercase tracking-[0.28em] text-achira-blue/55 dark:text-achira-cream/50">
            Төлбөр
          </h2>
          <div className="mt-3 flex rounded-2xl border border-achira-blue/10 p-1 dark:border-achira-cream/10">
            {(["qpay", "socialpay"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded-xl py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                  tab === t
                    ? "bg-achira-blue text-achira-cream dark:bg-achira-cream dark:text-achira-blue-dark"
                    : "text-achira-blue/55 dark:text-achira-cream/50"
                }`}
              >
                {t === "qpay" ? "QPay" : "SocialPay"}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-achira-blue/20 bg-achira-cream/40 px-4 py-10 dark:border-achira-cream/15 dark:bg-achira-navy/30">
            <div className="grid h-36 w-36 place-items-center rounded-2xl border border-achira-blue/15 bg-white text-center text-xs text-achira-blue/50 dark:border-achira-cream/15 dark:bg-achira-navy dark:text-achira-cream/45">
              {tab === "qpay" ? "QPay" : "SocialPay"} QR
            </div>
            <p className="mt-4 max-w-xs text-center text-[11px] leading-relaxed text-achira-blue/55 dark:text-achira-cream/50">
              Бодит төлбөрийн API холбогдох үед энд QR гарна. Одоо захиалга DB-д бүртгэгдэнэ.
            </p>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-2xl bg-achira-blue py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-achira-cream transition-transform active:scale-[0.98] disabled:opacity-60 dark:bg-achira-cream dark:text-achira-blue-dark"
          >
            {submitting ? "Бүртгэж байна..." : "Захиалга баталгаажуулах"}
          </button>
        </section>
      </form>
    </main>
  );
}
