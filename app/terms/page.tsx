export const metadata = {
  title: "Үйлчилгээний нөхцөл",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream">
        Үйлчилгээний нөхцөл
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
        Энэ хуудас нь Achira Artist аппын үйлчилгээний нөхцлийн эхний хувилбар
        (draft) юм. Дараагийн хувилбарт бүрэн нөхцөл оруулна.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-achira-blue/65 dark:text-achira-cream/60">
        <li>Цаг авалт төлбөр төлөгдсөн үед баталгаажна.</li>
        <li>Төлбөр төлөгдөөгүй захиалгыг систем автоматаар цуцалж болно.</li>
        <li>Хоцролт, цаг өөрчлөх бодлогыг салон дээр баталгаажуулна.</li>
      </ul>
    </main>
  );
}

