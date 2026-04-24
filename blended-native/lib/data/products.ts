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
  {
    slug: "sea-salt-texture-spray",
    name: "Sea Salt Texture Spray",
    priceMnt: 64000,
    description:
      "Далайн давстай спрей. Хөнгөн тогтоц, натурал текстур үүсгэнэ.",
    imageUrl:
      "https://images.unsplash.com/photo-1611930022073-84f46b60b0aa?w=800&h=800&fit=crop",
  },
  {
    slug: "scalp-refresh-tonic",
    name: "Scalp Refresh Tonic",
    priceMnt: 76000,
    description:
      "Хуйхны сэргээх тоник. Тослог/хуурайшилтыг тэнцвэржүүлж, сэрүүн мэдрэмж өгнө.",
    imageUrl:
      "https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=800&h=800&fit=crop",
  },
  {
    slug: "blended-precision-comb",
    name: "Blended Precision Comb",
    priceMnt: 32000,
    description:
      "Нарийн шүдтэй, тогтоц гаргахад тохиромжтой premium сам. Pocket-friendly.",
    imageUrl:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=800&fit=crop",
  },
  {
    slug: "aftershave-cooling-balm",
    name: "Aftershave Cooling Balm",
    priceMnt: 69000,
    description:
      "Сахлын дараах тайвшруулах бальзам. Улайлт, цочролыг багасгана.",
    imageUrl:
      "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800&h=800&fit=crop",
  },
  {
    slug: "daily-hydrate-conditioner",
    name: "Daily Hydrate Conditioner",
    priceMnt: 74000,
    description:
      "Өдөр тутмын чийгшүүлэгч кондишнэр. Үсийг зөөлрүүлж, гялалзуулна.",
    imageUrl:
      "https://images.unsplash.com/photo-1611930022190-0a9d4cb84ce8?w=800&h=800&fit=crop",
  },
  {
    slug: "beard-balm-soft-hold",
    name: "Beard Balm (Soft Hold)",
    priceMnt: 62000,
    description:
      "Сахал хэлбэржүүлэх зөөлөн тогтоцтой balm. Өдөр тутмын хэрэглээнд тохиромжтой.",
    imageUrl:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

