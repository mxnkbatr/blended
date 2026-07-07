import type { NextConfig } from "next";

const isMobileBuild = process.env.MOBILE_BUILD === "1";

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
  ...(isMobileBuild ? { output: "export" as const } : {}),
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
