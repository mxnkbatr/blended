import Link from "next/link";
import { AchiraLogo } from "./AchiraLogo";
import { AchiraWordmark } from "./AchiraWordmark";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-achira-blue/10 bg-achira-paper/40 backdrop-blur-sm dark:border-achira-cream/8 dark:bg-achira-navy/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <AchiraLogo className="h-12 w-12" />
              <AchiraWordmark size="md" className="items-start" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
              Гар урлалын сэтгэлгээтэй babershop ба үс арчилгааны бүтээгдэхүүн.
              Шуурхай үйлчилгээ, найдвартай захиалга.
            </p>
            <div className="mt-5 space-y-1 text-sm text-achira-blue/65 dark:text-achira-cream/60">
              <p>120k Regis Place 3rd floor, Ulaanbaatar</p>
              <a
                className="block transition-colors hover:text-achira-burgundy dark:hover:text-achira-cream"
                href="tel:77757747"
              >
                77757747
              </a>
              <p>10:00 — 22:00</p>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-achira-blue/50 dark:text-achira-cream/50">
                  Мэдээлэл
                </p>
                <ul className="mt-4 space-y-2 text-sm text-achira-blue/65 dark:text-achira-cream/60">
                  <li>
                    <Link
                      className="transition-colors hover:text-achira-blue-dark dark:hover:text-achira-cream"
                      href="/"
                    >
                      Бидний тухай
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-achira-blue-dark dark:hover:text-achira-cream"
                      href="/"
                    >
                      Үйлчилгээний нөхцөл
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-achira-blue-dark dark:hover:text-achira-cream"
                      href="/"
                    >
                      Хүргэлтийн нөхцөл
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-achira-blue-dark dark:hover:text-achira-cream"
                      href="/"
                    >
                      Төлбөрийн нөхцөл
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-achira-blue/50 dark:text-achira-cream/50">
                  Тусламж
                </p>
                <ul className="mt-4 space-y-2 text-sm text-achira-blue/65 dark:text-achira-cream/60">
                  <li>
                    <Link
                      className="transition-colors hover:text-achira-blue-dark dark:hover:text-achira-cream"
                      href="/booking"
                    >
                      Цаг авах
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-achira-blue-dark dark:hover:text-achira-cream"
                      href="/shop"
                    >
                      Дэлгүүр
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-achira-blue-dark dark:hover:text-achira-cream"
                      href="/checkout"
                    >
                      Сагс
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-achira-blue-dark dark:hover:text-achira-cream"
                      href="/profile"
                    >
                      Миний бүртгэл
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-achira-blue/50 dark:text-achira-cream/50">
                  Сошиал
                </p>
                <ul className="mt-4 space-y-2 text-sm text-achira-blue/65 dark:text-achira-cream/60">
                  <li>
                    <a
                      className="transition-colors hover:text-achira-blue-dark dark:hover:text-achira-cream"
                      href="#"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      className="transition-colors hover:text-achira-blue-dark dark:hover:text-achira-cream"
                      href="#"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-achira-blue/10 pt-6 text-xs text-achira-blue/50 dark:border-achira-cream/8 dark:text-achira-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © ACHIRA ARTIST {new Date().getFullYear()} — Бүх эрх хуулиар
            хамгаална.
          </p>
        </div>
      </div>
    </footer>
  );
}
