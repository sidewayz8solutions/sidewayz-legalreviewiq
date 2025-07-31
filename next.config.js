/** @type {import('next').NextConfig} */
const nextConfig = {
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

    // Ignore test files and directories to prevent build errors
    config.module.rules.push({
      test: /\.pdf$/,
      use: 'ignore-loader'
    });

    return config;
  },
  
  // Mark pdf-parse as external to prevent bundling issues
  serverExternalPackages: ['pdf-parse'],
};

module.exports = nextConfig;
