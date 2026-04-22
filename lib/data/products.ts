export type Product = {
  slug: string;
  name: string;
  priceMnt: number;
  description: string;
  imageUrl: string;
};

export const products: Product[] = [
  {
    slug: "blended-classic-wax",
    name: "Blended Classic Wax",
    priceMnt: 89000,
    description:
      "Өндөр гялалт, удаан хугацаанд хэлбэрээ хадгалах үсний вакс. Бүх үсний төрөлд тохирно.",
    imageUrl:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop",
  },
  {
    slug: "matte-texture-clay",
    name: "Matte Texture Clay",
    priceMnt: 95000,
    description:
      "Мат гадар, байгалийн харагдах байдал. Дунд барьцалтай, амархан угаагдана.",
    imageUrl:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=800&fit=crop",
  },
  {
    slug: "daily-fortify-shampoo",
    name: "Daily Fortify Shampoo",
    priceMnt: 72000,
    description:
      "Өдөр тутмын цэвэрлэгээ, чийгшүүлэлт. Хуурай, гэмтсэн үсийг сэргээнэ.",
    imageUrl:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
  },
  {
    slug: "beard-conditioning-oil",
    name: "Beard Conditioning Oil",
    priceMnt: 68000,
    description:
      "Сахалын арьс болон үсийг зөөлрүүлж, цочролыг багасгана. Хөнгөн үнэртэй.",
    imageUrl:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}
