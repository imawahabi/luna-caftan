import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Hide Next.js dev indicators/badge
  devIndicators: false,

  // Performance optimizations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Compress responses
  compress: true,
};

export default nextConfig;
