"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";
import { useCart } from "@/components/providers/CartProvider";

const MINIMAL_CHROME = ["/login", "/register", "/checkout", "/admin"];

export function MobileAppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { count } = useCart();
  const minimal = MINIMAL_CHROME.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const onBooking = pathname === "/booking" || pathname.startsWith("/booking/");
  const onProductDetail =
    pathname.startsWith("/shop/") && pathname !== "/shop";
  const bookingCtaVisible = !minimal && !onBooking && !onProductDetail;
  // Tab bar ~3.65rem + safe area; floating CTA ~3.25rem when visible
  const mobilePad = bookingCtaVisible
    ? "pb-[calc(8.75rem+env(safe-area-inset-bottom))]"
    : "pb-[calc(5.25rem+env(safe-area-inset-bottom))]";

  // checkout empty hides dock — avoid huge empty pad
  const dockHidden =
    pathname === "/checkout" && count === 0;

  return (
    <div
      className={`flex min-h-[calc(100dvh-3rem)] flex-col md:min-h-[calc(100dvh-4rem)] ${
        minimal || dockHidden ? "pb-0" : `${mobilePad} md:pb-0`
      }`}
    >
      {children}
      {/* Website footer — зөвхөн desktop; mobile/app дээр web шиг мэдрэмж үүсгэдэг */}
      {!minimal && (
        <div className="mt-auto hidden md:block">
          <SiteFooter />
        </div>
      )}
    </div>
  );
}
