// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// GO TO: https://supabase.com/dashboard → Your Project → Settings → API
// Copy these values EXACTLY (no quotes needed):
const SUPABASE_URL = 'https://qunaiicjcelvdunluwqh.supabase.co' // Replace with your Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bmFpaWNqY2VsdmR1bmx1d3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjA4NjEsImV4cCI6MjA2OTMzNjg2MX0.rFXwY95lvcXZEds7f16KodwhfnGHQBp7GsV4WTFQHjI' 
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bmFpaWNqY2VsdmR1bmx1d3FoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc2MDg2MSwiZXhwIjoyMDY5MzM2ODYxfQ.8Ugafib74_1btlN5acUz3rX2U4JyjHGWmSFsQthENMA' 

// Use environment variables if available, otherwise use hardcoded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_KEY

// Validate we have real values (check for placeholder values, not your actual project ID)
if (!supabaseUrl || supabaseUrl.includes('your-project-url-here')) {
  console.error('❌ SUPABASE_URL not configured! Edit src/lib/supabase.ts')
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-key-here')) {
  console.error('❌ SUPABASE_ANON_KEY not configured! Edit src/lib/supabase.ts')
}

if (!supabaseServiceKey || supabaseServiceKey.includes('your-service-key-here')) {
  console.error('❌ SUPABASE_SERVICE_KEY not configured! Edit src/lib/supabase.ts')
}

// Create clients - these will work even if env vars fail
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helpers
export const isSupabaseConfigured = () => {
  return supabaseUrl.includes('supabase.co') && !supabaseUrl.includes('your-project-url-here')
}

export const getSupabaseClient = () => supabase
export const getSupabaseAdmin = () => supabaseAdmin

// Log status (remove in production)
console.log('Supabase initialized with:', {
  url: supabaseUrl.substring(0, 30) + '...',
  hasAnonKey: !!supabaseAnonKey && supabaseAnonKey.length > 20,
  hasServiceKey: !!supabaseServiceKey && supabaseServiceKey.length > 20
})