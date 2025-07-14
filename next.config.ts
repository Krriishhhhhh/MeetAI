import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   typescript: {
    ignoreBuildErrors: true, // ✅ Turns off TypeScript type checking during build
  },
};

export default nextConfig;
