import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vsmov.com',
      },
      {
        protocol: 'https',
        hostname: '*.vsmov.com',
      },
      {
        protocol: 'https',
        hostname: 'nguon.vsphim.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      }
    ],
  },
};

export default nextConfig;
