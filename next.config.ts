import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Pin Turbopack workspace root to this project directory.
  // This avoids accidental root inference when another lockfile exists above.
  turbopack: {
    root: process.cwd(),
  },

  // Hide Next.js dev indicators/badge
  devIndicators: false,

  // Performance optimizations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Compress responses
  compress: true,
};

export default nextConfig;
