export const metadata = {
  title: "Privacy Policy",
  description: "Achira аппын нууцлалын бодлого",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream">
        Нууцлалын бодлого
      </h1>
      <p className="mt-2 text-xs text-achira-blue/45 dark:text-achira-cream/40">
        Сүүлд шинэчилсэн: 2026.07.14 · Achira (`mn.achira.app`)
      </p>

      <p className="mt-6 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
        Энэ бодлого нь Achira мобайл апп болон холбогдох вэб үйлчилгээ
        (цаашид “Үйлчилгээ”) хэрхэн хувийн мэдээлэл цуглуулж, ашиглаж, хамгаалж,
        устгаж байгааг тайлбарлана. Үйлчилгээг ашигласнаар та энэ бодлоготой
        танилцсанд тооцно.
      </p>

      <Section title="1. Мэдээлэл хариуцагч">
        <p>
          Үйлчилгээг Achira / Achira Artist барбершоп үйл ажиллагааны хүрээнд
          ашиглана. Холбоо барих: утас{" "}
          <a className="underline underline-offset-4" href="tel:88668612">
            88668612
          </a>
          , хаяг: 120k Regis Place, Улаанбаатар.
        </p>
      </Section>

      <Section title="2. Бид юу цуглуулдаг вэ">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Бүртгэл:</strong> нэр, утасны дугаар, нууц үг (шифрлэгдсэн
            хэлбэрээр хадгалагдана).
          </li>
          <li>
            <strong>Цаг авалт:</strong> сонгосон барбер, өдөр/цаг, захиалгын
            төлөв, урьдчилсан төлбөрийн төлөв.
          </li>
          <li>
            <strong>Дэлгүүр/захиалга:</strong> бараа, тоо хэмжээ, нийт дүн,
            хүргэлт/төлбөрийн холбоотой мэдээлэл.
          </li>
          <li>
            <strong>Төлбөр:</strong> QPay нэхэмжлэлийн төлөв. Бид таны банкны
            картны бүрэн дугаар хадгалдаггүй; төлбөрийг QPay боловсруулна.
          </li>
          <li>
            <strong>Мэдэгдэл:</strong> та зөвшөөрсөн тохиолдолд төхөөрөмжийн
            push notification token.
          </li>
          <li>
            <strong>Техникийн мэдээлэл:</strong> апп/төхөөрөмжийн төрөл, алдааны
            лог зэрэг үйлчилгээг ажиллуулахад шаардлагатай ерөнхий мэдээлэл.
          </li>
        </ul>
      </Section>

      <Section title="3. Юунд ашигладаг вэ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Нэвтрэх, бүртгэл үүсгэх, профил удирдах</li>
          <li>Цаг авалт болон дэлгүүрийн захиалга баталгаажуулах</li>
          <li>Төлбөр шалгах, баталгаажуулах (QPay)</li>
          <li>Захиалга/цэгийн талаар SMS эсвэл push мэдэгдэл илгээх</li>
          <li>Үйлчилгээ сайжруулах, дэмжлэг үзүүлэх, аюулгүй байдлыг хангах</li>
        </ul>
      </Section>

      <Section title="4. Хэнд дамжуулдаг вэ">
        <p>
          Бид таны мэдээллийг зарахгүй. Үйлчилгээг үзүүлэхийн тулд дараах
          үйлчилгээ үзүүлэгчидтэй хуваалцаж болно:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Supabase — бүртгэл, өгөгдлийн сан</li>
          <li>Vercel — вэб/API хостинг</li>
          <li>QPay — төлбөр боловсруулалт</li>
          <li>Twilio — SMS мэдэгдэл (тохиргооноос хамаарна)</li>
          <li>Firebase Cloud Messaging — push мэдэгдэл</li>
        </ul>
        <p className="mt-3">
          Хуулийн шаардлагаар эрх бүхий байгууллагаас хүсэлт ирвэл холбогдох
          мэдээллийг гаргаж болно.
        </p>
      </Section>

      <Section title="5. Хадгалалт">
        <p>
          Мэдээллийг үйлчилгээ үзүүлэх, хуулийн шаардлага хангах, маргаан
          шийдвэрлэхэд шаардлагатай хугацаанд хадгална. Бүртгэлээ устгасан үед
          профайл болон холбоотой хувийн танигдах мэдээллийг устгана эсвэл
          анонимжуулна.
        </p>
      </Section>

      <Section title="6. Бүртгэл / мэдээлэл устгах">
        <p>
          Та апп дотор{" "}
          <strong>Профайл → Тохиргоо → Бүртгэл устгах</strong> гэсэн үйлдлээр
          бүртгэлээ устгаж болно. Вэб заавар:{" "}
          <a className="underline underline-offset-4" href="/delete-account/">
            /delete-account
          </a>
          .
        </p>
        <p className="mt-3">
          Устгалтын дараа нэр, утас, профайл, push token устгагдана.
          Захиалга/цаг авалтын бүртгэлээс таны нэр, утас нууцлагдана. Устгалтыг
          буцаах боломжгүй.
        </p>
      </Section>

      <Section title="7. Таны эрх">
        <ul className="list-disc space-y-2 pl-5">
          <li>Өөрийн бүртгэлийн мэдээллийг харах, засах хүсэлт гаргах</li>
          <li>Бүртгэлээ устгах</li>
          <li>Push мэдэгдлээс төхөөрөмжийн тохиргоогоор татгалзах</li>
        </ul>
      </Section>

      <Section title="8. Хүүхдийн мэдээлэл">
        <p>
          Үйлчилгээ нь 13-аас доош насныханд зориулагдаагүй. Бид мэдсээр хүүхдийн
          мэдээлэл цуглуулахыг зорьдоггүй.
        </p>
      </Section>

      <Section title="9. Бодлогын өөрчлөлт">
        <p>
          Бид энэ бодлогыг шинэчилж болно. Шинэчилсэн хувилбарыг энэ хуудсанд
          нийтэлнэ. Чухал өөрчлөлтийн талаар апп эсвэл вэбээр мэдэгдэж болно.
        </p>
      </Section>

      <Section title="10. Холбоо барих">
        <p>
          Нууцлалтай холбоотой асуулт:{" "}
          <a className="underline underline-offset-4" href="tel:88668612">
            88668612
          </a>
          .
        </p>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-achira-blue-dark dark:text-achira-cream">
        {title}
      </h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
        {children}
      </div>
    </section>
  );
}
