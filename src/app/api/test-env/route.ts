import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : 'MISSING',
  }

  // Test Supabase connection and check tables
  let supabaseTest = 'NOT_TESTED'
  let tableCheck = {}
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )

      // Check each required table
      const tables = ['contracts', 'contract_analyses', 'usage_events', 'organizations', 'users']
      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('*').limit(1)
          if (error) {
            tableCheck[table] = `ERROR: ${error.message}`
          } else {
            tableCheck[table] = `EXISTS (${data?.length || 0} records)`
          }
        } catch (err) {
          tableCheck[table] = `EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`
        }
      }

      // Get sample organization and user IDs for testing
      try {
        const { data: orgs } = await supabase.from('organizations').select('id').limit(1)
        const { data: users } = await supabase.from('users').select('id').limit(1)
        tableCheck['sample_org_id'] = orgs?.[0]?.id || 'NONE'
        tableCheck['sample_user_id'] = users?.[0]?.id || 'NONE'
      } catch (err) {
        tableCheck['sample_ids'] = 'ERROR_GETTING_SAMPLES'
      }

      supabaseTest = 'CONNECTION_SUCCESS'
    } catch (err) {
      supabaseTest = `EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`
    }
  }

  // Test OpenAI connection
  let openaiTest = 'NOT_TESTED'
  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = (await import('openai')).default
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
      
      // Just test if we can create the client without making an API call
      openaiTest = 'CLIENT_CREATED'
    } catch (err) {
      openaiTest = `ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`
    }
  }

  return NextResponse.json({
    environmentVariables: envCheck,
    supabaseTest,
    tableCheck,
    openaiTest,
    timestamp: new Date().toISOString()
  })
}
