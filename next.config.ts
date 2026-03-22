import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.31.64.1'],
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;