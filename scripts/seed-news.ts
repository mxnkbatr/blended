import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
config();

async function main() {
  const connectionString =
    process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
  if (!connectionString) throw new Error("DIRECT_URL required");

  const client = new pg.Client({ connectionString });
  await client.connect();
  await client.query(
    `insert into public.news_posts (slug, title, excerpt, body, published)
     values ($1, $2, $3, $4, true)
     on conflict (slug) do nothing`,
    [
      "achira-medee-ehlelt",
      "Achira апп шинэчлэгдлээ",
      "Мэдээ, цаг захиалга, дэлгүүр — бүгд нэг дор.",
      "Сайн байна уу!\n\nAchira апп дээр одоо мэдээ мэдээллийн хэсэг нээгдлээ. Урамшуулал, цагийн өөрчлөлт, шинэ бүтээгдэхүүний мэдээг эндээс шууд унших боломжтой.\n\nЦаг захиалга болон дэлгүүрийн үйлчилгээгээ үргэлжлүүлэн ашиглаарай.",
    ],
  );
  const { rows } = await client.query(
    "select slug, title, published from news_posts order by published_at desc",
  );
  console.log(rows);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
