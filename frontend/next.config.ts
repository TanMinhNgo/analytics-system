import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Disable Image Optimization for static export
  images: {
    unoptimized: true,
  },
  // Ensure proper trailing slashes
  trailingSlash: true,
  // Disable server-side features for static export
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
