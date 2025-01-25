import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      // this setting is for default caching similar to next 14
      dynamic: 30,
      static: 180, // 180 seconds
    },
  },
};

export default nextConfig;
