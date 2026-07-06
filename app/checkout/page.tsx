"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { hapticLight, hapticSuccess } from "@/lib/haptics";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

type PayTab = "qpay" | "socialpay";

type QPayPayload = {
  invoiceId: string;
  qrText: string | null;
  qrImage: string | null;
  shortUrl: string | null;
  urls: { name: string; description: string; logo: string; link: string }[];
};

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
  const [orderTotalMnt, setOrderTotalMnt] = useState(0);
  const [qpay, setQpay] = useState<QPayPayload | null>(null);
  const [paid, setPaid] = useState(false);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!orderId || paid || tab !== "qpay") return;

    let cancelled = false;
    setPolling(true);

    const tick = async () => {
      try {
        const res = await fetch(`/api/checkout/?orderId=${orderId}`);
        const data = (await res.json()) as { paid?: boolean };
        if (!cancelled && data.paid) {
          setPaid(true);
          setPolling(false);
          await hapticSuccess();
        }
      } catch {
        /* retry on next interval */
      }
    };

    void tick();
    const id = window.setInterval(tick, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      setPolling(false);
    };
  }, [orderId, paid, tab]);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24">
        <div className="h-40 animate-pulse rounded-2xl bg-achira-blue/5" />
      </main>
    );
  }

  if (orderId && paid) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-achira-blue/15 bg-achira-blue/8 text-achira-blue dark:border-achira-cream/15 dark:bg-achira-cream/10 dark:text-achira-cream">
          <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl text-achira-blue-dark dark:text-achira-cream">
          Төлбөр амжилттай
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
          Захиалга баталгаажлаа. Бүтээгдэхүүн бэлдэж эхэлнэ.
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

  if (orderId && tab === "qpay" && qpay) {
    const qrSrc = qpay.qrImage
      ? qpay.qrImage.startsWith("data:")
        ? qpay.qrImage
        : `data:image/png;base64,${qpay.qrImage}`
      : null;

    return (
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <h1 className="text-center font-[family-name:var(--font-display)] text-3xl text-achira-blue-dark dark:text-achira-cream">
          QPay төлбөр
        </h1>
        <p className="mt-2 text-center text-sm text-achira-blue/60 dark:text-achira-cream/55">
          Банкны апп эсвэл wallet-аар QR уншуулна уу.
        </p>

        <div className="mt-8 flex flex-col items-center rounded-3xl border border-achira-blue/10 bg-white/70 p-6 dark:border-achira-cream/10 dark:bg-achira-navy/40">
          {qrSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrSrc}
              alt="QPay QR"
              className="h-56 w-56 rounded-2xl border border-achira-blue/10 bg-white p-2"
            />
          ) : (
            <div className="grid h-56 w-56 place-items-center rounded-2xl border border-dashed border-achira-blue/20 bg-achira-cream/40 text-center text-xs text-achira-blue/50">
              QR ачааллаж байна...
            </div>
          )}

          <p className="mt-4 text-lg font-semibold text-achira-blue-dark dark:text-achira-cream">
            {formatMnt(orderTotalMnt)}
          </p>
          {paymentRef && (
            <p className="mt-2 font-mono text-xs text-achira-blue/55 dark:text-achira-cream/50">
              {paymentRef}
            </p>
          )}

          {polling && (
            <p className="mt-4 flex items-center gap-2 text-xs text-achira-blue/55 dark:text-achira-cream/50">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Төлбөр хүлээж байна...
            </p>
          )}

          {qpay.urls.length > 0 && (
            <ul className="mt-6 w-full space-y-2">
              {qpay.urls.slice(0, 6).map((bank) => (
                <li key={bank.link}>
                  <a
                    href={bank.link}
                    className="flex items-center gap-3 rounded-2xl border border-achira-blue/10 px-3 py-2.5 text-sm text-achira-blue-dark transition-colors hover:bg-achira-blue/5 dark:border-achira-cream/10 dark:text-achira-cream dark:hover:bg-achira-cream/5"
                  >
                    {bank.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={bank.logo} alt="" className="h-8 w-8 rounded-lg object-contain" />
                    ) : (
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-achira-blue/10 text-[10px] font-bold">
                        {bank.name.slice(0, 2)}
                      </span>
                    )}
                    <span>{bank.description || bank.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {qpay.shortUrl && (
            <a
              href={qpay.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs text-achira-blue underline underline-offset-2 dark:text-achira-cream"
            >
              QPay холбоосоор төлөх
            </a>
          )}
        </div>
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
          SocialPay QR-аар төлбөрөө хийнэ үү.
        </p>
        {paymentRef && (
          <p className="mt-4 rounded-2xl border border-achira-blue/12 bg-achira-paper/60 px-4 py-3 font-mono text-sm text-achira-blue-dark dark:border-achira-cream/10 dark:bg-achira-blue/10 dark:text-achira-cream">
            {paymentRef}
          </p>
        )}
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

    try {
      const res = await fetch("/api/checkout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          paymentMethod: tab,
          userId: user?.id ?? null,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        orderId?: string;
        paymentRef?: string;
        qpay?: QPayPayload;
      };

      if (!res.ok || !data.orderId) {
        setError(data.error ?? "Захиалга үүсгэж чадсангүй.");
        setSubmitting(false);
        return;
      }

      setOrderId(data.orderId);
      setPaymentRef(data.paymentRef ?? null);
      setOrderTotalMnt(totalMnt);
      if (data.qpay) setQpay(data.qpay);
      clear();
      router.refresh();
    } catch {
      setError("Сүлжээний алдаа. Дахин оролдоно уу.");
    }

    setSubmitting(false);
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

          <div className="mt-5 rounded-2xl border border-dashed border-achira-blue/20 bg-achira-cream/40 px-4 py-6 dark:border-achira-cream/15 dark:bg-achira-navy/30">
            <p className="text-center text-[11px] leading-relaxed text-achira-blue/55 dark:text-achira-cream/50">
              {tab === "qpay"
                ? "Захиалга баталгаажуулахад QPay QR код гарна."
                : "SocialPay холболт удахгүй нэмэгдэнэ."}
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
