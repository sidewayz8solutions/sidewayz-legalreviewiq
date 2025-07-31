import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for pdf-parse package trying to access test files during build
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Ignore test files and directories
    config.module.rules.push({
      test: /\.pdf$/,
      use: 'ignore-loader'
    });

    // Optimize for Hugging Face transformers
    config.resolve.alias = {
      ...config.resolve.alias,
      '@xenova/transformers': '@xenova/transformers/dist/transformers.min.js'
    };

    return config;
  },
  serverExternalPackages: ['pdf-parse', '@xenova/transformers'],
  experimental: {
    serverComponentsExternalPackages: ['@xenova/transformers']
  }
};

export default nextConfig;
