// next.config.js
// Add this to your next.config.js file to force env vars into the build

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force environment variables into the build
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here',
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Log build environment
    console.log('Build Environment:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      buildId,
      isServer
    })

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

    return config
  },

  // External packages for server-side rendering
  serverExternalPackages: ['pdf-parse', '@xenova/transformers'],
  experimental: {
    serverComponentsExternalPackages: ['@xenova/transformers']
  }
}

module.exports = nextConfig