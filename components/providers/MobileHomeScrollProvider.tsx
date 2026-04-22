"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MobileHomeScrolledContext = createContext(false);

export function useMobileHomeScrolled() {
  return useContext(MobileHomeScrolledContext);
}

export function MobileHomeScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <MobileHomeScrolledContext.Provider value={scrolled}>
      {children}
    </MobileHomeScrolledContext.Provider>
  );
}
