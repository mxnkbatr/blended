import type { NextConfig } from "next";

const isMobileBuild = process.env.MOBILE_BUILD === "1";

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
    ],
  },
};

export default nextConfig;
