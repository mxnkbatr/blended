import { existsSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// File flag is more reliable than env alone on Appflow Mac runners.
const mobileFlag = path.join(process.cwd(), ".mobile-build");
const isMobileBuild =
  process.env.MOBILE_BUILD === "1" || existsSync(mobileFlag);

if (isMobileBuild) {
  console.log("[next.config] Mobile static export enabled (webDir → out/)");
}

function supabaseImagePattern() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return {
      protocol: "https" as const,
      hostname: new URL(url).hostname,
      pathname: "/storage/v1/object/public/**",
    };
  } catch {
    return null;
  }
}

const supabasePattern = supabaseImagePattern();

const nextConfig: NextConfig = {
  // Do not set a custom distDir with output:"export" — Next 16 writes the
  // static site into distDir instead of ./out, which breaks Capacitor/Appflow.
  ...(isMobileBuild ? { output: "export" as const } : {}),
  allowedDevOrigins: ["192.168.1.175"],
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      ...(supabasePattern ? [supabasePattern] : []),
    ],
  },
};

export default nextConfig;
