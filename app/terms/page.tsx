export const metadata = {
  title: "Үйлчилгээний нөхцөл",
  description: "Achira аппын үйлчилгээний нөхцөл",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.06em] text-achira-blue-dark dark:text-achira-cream">
        Үйлчилгээний нөхцөл
      </h1>
      <p className="mt-2 text-xs text-achira-blue/45 dark:text-achira-cream/40">
        Сүүлд шинэчилсэн: 2026.07.14 · Achira
      </p>

      <p className="mt-6 text-sm leading-relaxed text-achira-blue/65 dark:text-achira-cream/60">
        Achira апп болон вэб үйлчилгээг ашигласнаар та энэхүү нөхцөлийг хүлээн
        зөвшөөрсөнд тооцно.
      </p>

      <Section title="1. Үйлчилгээ">
        <p>
          Achira нь барбершоп цаг захиалах, мэдээлэл авах, мөн салон/дэлгүүрийн
          бүтээгдэхүүн захиалах боломжийг олгоно. Энэ нь дижитал бараа (in-app
          digital goods) биш, бодит үйлчилгээ болон физик бүтээгдэхүүнтэй
          холбоотой захиалга юм.
        </p>
      </Section>

      <Section title="2. Бүртгэл">
        <p>
          Та зөв утасны дугаар, нууц үгээр бүртгүүлнэ. Бүртгэлийн мэдээллийн
          үнэн зөв, нууцлалыг хадгалах үүрэг танд байна. Бусад хүний нэрээр
          бүртгүүлэхийг хориглоно.
        </p>
      </Section>

      <Section title="3. Цаг авалт">
        <ul className="list-disc space-y-2 pl-5">
          <li>Цаг авалт төлбөр (урьдчилгаа) төлөгдсөн үед баталгаажна.</li>
          <li>
            Төлбөр төлөгдөөгүй захиалгыг систем автоматаар цуцалж, цагийг чөлөөлж
            болно.
          </li>
          <li>
            Хоцролт, цаг өөрчлөх, цуцлах бодлогыг салон дээр нэмж баталгаажуулна.
          </li>
        </ul>
      </Section>

      <Section title="4. Төлбөр">
        <p>
          Төлбөрийг QPay болон салон дэмждэг бусад аргаар хийж болно. Амжилттай
          төлбөрийн дараа баримт/төлөв апп эсвэл SMS-ээр харагдана. Буруу
          мэдээлэл оруулснаас үүдэлтэй алдааны хариуцлагыг хэрэглэгч хүлээнэ.
        </p>
      </Section>

      <Section title="5. Дэлгүүр">
        <p>
          Бүтээгдэхүүний үнэ, нөөц өөрчлөгдөж болно. Захиалга хүлээн авсны
          дараа хүргэлт/авалтын нөхцөлийг салон баталгаажуулна.
        </p>
      </Section>

      <Section title="6. Хүлээн зөвшөөрөхгүй үйлдэл">
        <ul className="list-disc space-y-2 pl-5">
          <li>Системд зөвшөөрөлгүй нэвтрэх, бусдад хорлох оролдлого</li>
          <li>Хуурамч захиалга, төлбөрийн залилан</li>
          <li>Үйлчилгээг хууль бусаар ашиглах</li>
        </ul>
      </Section>

      <Section title="7. Хариуцлагын хязгаар">
        <p>
          Бид үйлчилгээг тасралтгүй, алдаагүй ажиллуулахыг зорьно. Гэхдээ
          сүлжээ, гуравдагч систем (QPay, SMS, түлхэх мэдэгдэл)-ээс үүдэлтэй
          түр саатал гарч болно. Хуулиар зөвшөөрөгдөх хэмжээнд шууд бус хохирлын
          хариуцлагыг хязгаарлана.
        </p>
      </Section>

      <Section title="8. Нууцлал">
        <p>
          Хувийн мэдээллийн боловсруулалтыг{" "}
          <a className="underline underline-offset-4" href="/privacy/">
            Нууцлалын бодлого
          </a>
          -оор зохицуулна.
        </p>
      </Section>

      <Section title="9. Өөрчлөлт">
        <p>
          Бид нөхцөлийг шинэчилж болно. Шинэчилсэн нөхцөл энэ хуудсанд
          нийтлэгдэнэ.
        </p>
      </Section>

      <Section title="10. Холбоо барих">
        <p>
          Асуулт:{" "}
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
