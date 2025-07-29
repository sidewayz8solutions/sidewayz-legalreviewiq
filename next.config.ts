import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for pdf-parse package trying to access test files during build
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Ignore test files and directories
    config.module.rules.push({
      test: /\.pdf$/,
      use: 'ignore-loader'
    });

    return config;
  },
  serverExternalPackages: ['pdf-parse']
};

export default nextConfig;
