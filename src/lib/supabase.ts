// src/lib/supabase.ts
// EMERGENCY FIX - Replace your current supabase.ts with this
// Fill in your actual values from Supabase dashboard

import { createClient } from '@supabase/supabase-js'

// GO TO: https://supabase.com/dashboard → Your Project → Settings → API
// Copy these values EXACTLY (no quotes needed):
const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co' // Replace with your Project URL
const SUPABASE_ANON_KEY = 'your-very-long-anon-key-here' // Replace with anon public key  
const SUPABASE_SERVICE_KEY = 'your-very-long-service-key-here' // Replace with service_role key

// Fallback to env vars if available (for when you fix the env issue later)
const supabaseUrl = SUPABASE_URL.includes('YOUR_PROJECT_REF') 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
  : SUPABASE_URL

const supabaseAnonKey = SUPABASE_ANON_KEY.includes('your-very-long') 
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
  : SUPABASE_ANON_KEY

const supabaseServiceKey = SUPABASE_SERVICE_KEY.includes('your-very-long')
  ? process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_KEY
  : SUPABASE_SERVICE_KEY

// Validate we have real values
if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT_REF')) {
  console.error('❌ SUPABASE_URL not configured! Edit src/lib/supabase.ts')
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-very-long')) {
  console.error('❌ SUPABASE_ANON_KEY not configured! Edit src/lib/supabase.ts')
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
  return supabaseUrl.includes('supabase.co') && !supabaseUrl.includes('YOUR_PROJECT_REF')
}

export const getSupabaseClient = () => supabase
export const getSupabaseAdmin = () => supabaseAdmin

// Log status (remove in production)
console.log('Supabase initialized with:', {
  url: supabaseUrl.substring(0, 30) + '...',
  hasAnonKey: !!supabaseAnonKey && supabaseAnonKey.length > 20,
  hasServiceKey: !!supabaseServiceKey && supabaseServiceKey.length > 20
})