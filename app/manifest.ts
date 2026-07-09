import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Achira",
    short_name: "Achira",
    description: "Achira Artist — Barbershop. Цаг авах, дэлгүүр.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe6",
    theme_color: "#1e4f96",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

