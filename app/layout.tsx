import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { BottomDock } from "@/components/BottomDock";
import { CartProvider } from "@/components/providers/CartProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { NotificationsProvider } from "@/components/providers/NotificationsProvider";
import { MobileHomeScrollProvider } from "@/components/providers/MobileHomeScrollProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Blended | Barbershop",
    template: "%s | Blended",
  },
  description:
    "Blended — тансаг babershop. Улаанбаатар, Regis Place. Цаг авах, дэлгүүр.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="mn"
      className={`${playfair.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} min-h-full bg-white text-zinc-950 antialiased dark:bg-black dark:text-white`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <WishlistProvider>
                <NotificationsProvider>
                  <MobileHomeScrollProvider>
                    <SiteHeader />
                    <AppHeader />
                    <div className="flex min-h-[calc(100dvh-3rem)] flex-col pb-[10rem] md:min-h-[calc(100dvh-4rem)] md:pb-0">
                      {children}
                      <SiteFooter />
                    </div>
                    <BottomDock />
                  </MobileHomeScrollProvider>
                </NotificationsProvider>
              </WishlistProvider>
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
