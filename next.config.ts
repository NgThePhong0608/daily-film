import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'phim.nguonc.com',
      },
      {
        protocol: 'https',
        hostname: '*.nguonc.com',
      },
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
        hostname: '*.vsphim.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
