import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your Next.js config options go here
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
