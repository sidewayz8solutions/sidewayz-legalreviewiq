import { createClient } from '@supabase/supabase-js'

// Check if we have valid Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const hasValidCredentials = supabaseUrl &&
  supabaseAnonKey &&
  supabaseServiceKey &&
  !supabaseUrl.includes('dummy') &&
  !supabaseAnonKey.includes('dummy') &&
  !supabaseServiceKey.includes('dummy')

// For client-side operations
export const supabase = hasValidCredentials ? createClient(
  supabaseUrl!,
  supabaseAnonKey!
) : null

// For server-side operations with full access
export const supabaseAdmin = hasValidCredentials ? createClient(
  supabaseUrl!,
  supabaseServiceKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => hasValidCredentials
