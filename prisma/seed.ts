import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

config({ path: ".env.local" });
config();

const barbers = [
  {
    id: "b1",
    name: "Энхбат",
    title: "Senior Barber",
    imageUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&h=920&crop=faces",
  },
  {
    id: "b2",
    name: "Батбаяр",
    title: "Master Stylist",
    imageUrl:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&h=920&crop=faces",
  },
  {
    id: "b3",
    name: "Төмөр",
    title: "Barber",
    imageUrl:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&h=920&crop=faces",
  },
] as const;

const products = [
  {
    slug: "blended-classic-wax",
    name: "Blended Classic Wax",
    description:
      "Өндөр гялалт, удаан хугацаанд хэлбэрээ хадгалах үсний вакс. Бүх үсний төрөлд тохирно.",
    priceMnt: 89000,
    imageUrl:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop",
  },
  {
    slug: "matte-texture-clay",
    name: "Matte Texture Clay",
    description:
      "Мат гадар, байгалийн харагдах байдал. Дунд барьцалтай, амархан угаагдана.",
    priceMnt: 95000,
    imageUrl:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=800&fit=crop",
  },
  {
    slug: "daily-fortify-shampoo",
    name: "Daily Fortify Shampoo",
    description:
      "Өдөр тутмын цэвэрлэгээ, чийгшүүлэлт. Хуурай, гэмтсэн үсийг сэргээнэ.",
    priceMnt: 72000,
    imageUrl:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
  },
  {
    slug: "beard-conditioning-oil",
    name: "Beard Conditioning Oil",
    description:
      "Сахалын арьс болон үсийг зөөлрүүлж, цочролыг багасгана. Хөнгөн үнэртэй.",
    priceMnt: 68000,
    imageUrl:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop",
  },
] as const;

const connectionString =
  process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? "";

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL is required for seeding.");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  for (const barber of barbers) {
    await prisma.barber.upsert({
      where: { id: barber.id },
      create: barber,
      update: {
        name: barber.name,
        title: barber.title,
        imageUrl: barber.imageUrl,
        active: true,
      },
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: product,
      update: {
        name: product.name,
        description: product.description,
        priceMnt: product.priceMnt,
        imageUrl: product.imageUrl,
        inStock: true,
      },
    });
  }

  console.log(`Seeded ${barbers.length} barbers, ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
