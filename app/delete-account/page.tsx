export const metadata = {
  title: "Delete account",
  description: "Achira бүртгэл устгах заавар",
};

export default function DeleteAccountPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream">
        Бүртгэл устгах
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
        Achira апп дахь бүртгэл болон хувийн мэдээллээ дараах байдлаар устгана.
      </p>

      <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-achira-blue/70 dark:text-achira-cream/65">
        <li>Achira апп эсвэл вэб рүү нэвтэрнэ.</li>
        <li>
          <strong>Профайл → Тохиргоо</strong> цэс рүү орно.
        </li>
        <li>
          <strong>Бүртгэл устгах</strong> товч дээр дарж баталгаажуулна.
        </li>
      </ol>

      <p className="mt-6 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
        Устгагддаг зүйлс: нэр, утас, профайл, push token. Захиалга/цаг авалтын
        бүртгэлээс таны нэр, утас нууцлагдана. Устгалтыг буцаах боломжгүй.
      </p>

      <p className="mt-4 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
        Апп суулгаагүй бол нэвтэрч:{" "}
        <a
          className="underline underline-offset-4"
          href="https://blended-phi.vercel.app/settings/"
        >
          blended-phi.vercel.app/settings
        </a>
      </p>
    </main>
  );
}
