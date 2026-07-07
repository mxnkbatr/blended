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
import { MobileAppChrome } from "@/components/MobileAppChrome";
import { SiteHeader } from "@/components/SiteHeader";
import { AppSplash } from "@/components/AppSplash";
import { CapacitorInit } from "@/components/CapacitorInit";
import { CapacitorBackButton } from "@/components/CapacitorBackButton";
import { KeyboardInsetSync } from "@/components/KeyboardInsetSync";
import { ThemeCapacitorSync } from "@/components/ThemeCapacitorSync";
import { PushNotificationsInit } from "@/components/PushNotificationsInit";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AuthGate } from "@/components/AuthGate";
import { MobileShellLayoutGroup } from "@/components/MobileShellLayoutGroup";
import { PageTransition } from "@/components/PageTransition";
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
    default: "Achira Artist | Barbershop",
    template: "%s | Achira Artist",
  },
  description:
    "Achira Artist — гар урлалын сэтгэлгээтэй babershop. Улаанбаатар, Regis Place. Цаг авах, дэлгүүр.",
  applicationName: "Achira Artist",
  themeColor: "#1e4f96",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Achira Artist",
  },
  formatDetection: {
    telephone: false,
  },
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
      className={`${playfair.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} min-h-full bg-achira-cream text-achira-ink antialiased dark:bg-achira-navy dark:text-achira-cream`}
      >
        <ThemeProvider>
          <AuthProvider>
            <PushNotificationsInit />
            <CapacitorInit />
            <CapacitorBackButton />
            <KeyboardInsetSync />
            <ThemeCapacitorSync />
            <AppSplash />
            <LanguageProvider>
              <CartProvider>
                <WishlistProvider>
                  <NotificationsProvider>
                    <MobileHomeScrollProvider>
                      <AuthGate>
                        <SiteHeader />
                        <AppHeader />
                        <MobileShellLayoutGroup>
                          <MobileAppChrome>
                            <PageTransition>{children}</PageTransition>
                          </MobileAppChrome>
                        </MobileShellLayoutGroup>
                        <BottomDock />
                      </AuthGate>
                    </MobileHomeScrollProvider>
                  </NotificationsProvider>
                </WishlistProvider>
              </CartProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
