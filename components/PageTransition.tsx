"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const TAB_ROOTS = ["/", "/booking", "/news", "/profile", "/shop"] as const;

function isTabRoot(path: string) {
  return TAB_ROOTS.some((r) => path === r);
}

function navDirection(prev: string, curr: string) {
  if (isTabRoot(prev) && isTabRoot(curr)) return 0;
  if (curr.startsWith(prev) && curr !== prev) return 1;
  if (prev.startsWith(curr) && curr !== prev) return -1;
  return 0;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const dirRef = useRef(0);

  if (prevPath.current !== pathname) {
    dirRef.current = navDirection(prevPath.current, pathname);
    prevPath.current = pathname;
  }

  const dir = dirRef.current;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={
          dir === 0
            ? { opacity: 0, scale: 0.992 }
            : { opacity: 0, x: dir * 18 }
        }
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={
          dir === 0
            ? { opacity: 0, scale: 1.004 }
            : { opacity: 0, x: dir * -12 }
        }
        transition={{
          type: "tween",
          duration: dir === 0 ? 0.16 : 0.22,
          ease: [0.32, 0.72, 0, 1],
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
