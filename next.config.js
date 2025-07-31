// next.config.js
// Add this to your next.config.js file to force env vars into the build

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force environment variables into the build
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here',
  },
  
  // Optional: Log during build to verify
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    console.log('Build Environment:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      buildId,
      isServer
    })
    return config
  },
}

module.exports = nextConfig