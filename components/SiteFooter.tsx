import Link from "next/link";
import { BlendedMark } from "./BlendedMark";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-white/[0.06] bg-black/30 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-white">
              <BlendedMark className="h-7 w-12 text-white/90" />
              <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.28em] text-white/90">
                BLENDED
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
              Тансаг babershop ба үс арчилгааны бүтээгдэхүүн. Шуурхай үйлчилгээ,
              найдвартай захиалга.
            </p>
            <div className="mt-5 space-y-1 text-sm text-zinc-500">
              <p>120k Regis Place 3rd floor, Ulaanbaatar</p>
              <a className="block hover:text-zinc-300" href="tel:77757747">
                77757747
              </a>
              <p>10:00 — 22:00</p>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-600">
                  Мэдээлэл
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-500">
                  <li>
                    <Link className="hover:text-zinc-300" href="/">
                      Бидний тухай
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-zinc-300" href="/">
                      Үйлчилгээний нөхцөл
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-zinc-300" href="/">
                      Хүргэлтийн нөхцөл
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-zinc-300" href="/">
                      Төлбөрийн нөхцөл
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-600">
                  Тусламж
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-500">
                  <li>
                    <Link className="hover:text-zinc-300" href="/booking">
                      Цаг авах
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-zinc-300" href="/shop">
                      Дэлгүүр
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-zinc-300" href="/checkout">
                      Сагс
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-zinc-300" href="/profile">
                      Миний бүртгэл
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-600">
                  Сошиал
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-500">
                  <li>
                    <a className="hover:text-zinc-300" href="#">
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-zinc-300" href="#">
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© BLENDED {new Date().getFullYear()} — Бүх эрх хуулиар хамгаална.</p>
          <p className="text-zinc-700">Online shop layout inspiration: N9NE</p>
        </div>
      </div>
    </footer>
  );
}

