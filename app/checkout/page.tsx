"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";

function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN").format(n) + " ₮";
}

type PayTab = "qpay" | "socialpay";

export default function CheckoutPage() {
  const { lines, setQty, removeLine, totalMnt, clear } = useCart();
  const [tab, setTab] = useState<PayTab>("qpay");

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-white">
          Сагс хоосон байна
        </h1>
        <p className="mt-4 text-sm text-zinc-500">
          Дэлгүүрээс бүтээгдэхүүн сонгон сагсандаа нэмнэ үү.
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-widest text-black"
        >
          Дэлгүүр рүү
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-20">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-white sm:text-4xl">
        Төлбөр
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Захиалгын дүн болон QPay / SocialPay-ээр төлөх QR (UI загвар).
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Сагс
          </h2>
          <ul className="mt-6 divide-y divide-zinc-800">
            {lines.map((line) => (
              <li
                key={line.slug}
                className="flex gap-4 py-5 first:pt-0"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-800">
                  <Image
                    src={line.imageUrl}
                    alt={line.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{line.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {formatMnt(line.priceMnt)} × {line.qty}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="sr-only">Тоо ширхэг</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={line.qty}
                      onChange={(e) =>
                        setQty(line.slug, Number.parseInt(e.target.value, 10) || 1)
                      }
                      className="w-16 rounded-lg border border-zinc-800 bg-black px-2 py-1 text-center text-sm text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeLine(line.slug)}
                      className="text-xs uppercase tracking-wider text-zinc-500 hover:text-red-400"
                    >
                      Хасах
                    </button>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-medium text-white">
                  {formatMnt(line.priceMnt * line.qty)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-6">
            <span className="text-sm text-zinc-400">Нийт дүн</span>
            <span className="text-lg font-medium text-white">
              {formatMnt(totalMnt)}
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 sm:p-8">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Төлбөрийн хэрэгсэл
          </h2>
          <div className="mt-6 flex rounded-full border border-zinc-800 p-1">
            <button
              type="button"
              onClick={() => setTab("qpay")}
              className={`flex-1 rounded-full py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === "qpay"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              QPay
            </button>
            <button
              type="button"
              onClick={() => setTab("socialpay")}
              className={`flex-1 rounded-full py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === "socialpay"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              SocialPay
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-zinc-700 bg-black/40 px-6 py-12">
            <div className="grid h-44 w-44 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-600">
              <span className="px-4 text-center text-xs leading-relaxed">
                {tab === "qpay" ? "QPay" : "SocialPay"} QR
                <br />
                (жишээ)
              </span>
            </div>
            <p className="mt-6 max-w-xs text-center text-xs leading-relaxed text-zinc-500">
              Бодит QR-ыг төлбөрийн API-аас аваад энд зураг эсвэл SVG-ээр
              солино. Одоогоор UI-ийн байрлал, хэмжээг бэлдсэн.
            </p>
          </div>

          <p className="mt-8 text-center text-[11px] text-zinc-600">
            Гүйлгээний утга:{" "}
            <span className="text-zinc-400">BLENDED ORDER</span>
          </p>

          <button
            type="button"
            onClick={() => clear()}
            className="mt-10 w-full rounded-full border border-zinc-700 py-3 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
          >
            Захиалга цэвэрлэх (жишээ)
          </button>
        </section>
      </div>
    </main>
  );
}
