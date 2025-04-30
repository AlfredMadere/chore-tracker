import type { NextConfig } from "next";
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
  // Configure Turbopack
  experimental: {
    turbo: {
      // Turbopack configuration options
      resolveAlias: {
        // Add any aliases needed for Turbopack
      },
    },
  },
};

export default nextConfig;
