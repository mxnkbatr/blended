export const metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
        Энэ хуудас нь Achira Artist аппын нууцлалын бодлогын товч мэдээлэл юм.
        Дараагийн хувилбарт дэлгэрэнгүй бодлогыг оруулна.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-achira-blue/65 dark:text-achira-cream/60">
        <li>Бүртгэл: нэр, утасны дугаар</li>
        <li>Захиалга/цаг авалт: түүх болон төлбөрийн төлөв</li>
        <li>Push notification: төхөөрөмжийн token (хэрэв зөвшөөрвөл)</li>
      </ul>
    </main>
  );
}

