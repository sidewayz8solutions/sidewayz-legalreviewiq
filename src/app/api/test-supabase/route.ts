import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
    }

    // Check if Supabase is available
    const available =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const adminClientExists = !!supabaseAdmin

    let connectionTest = 'NOT_TESTED'
    let tableCheck: { [key: string]: string } = {}

    if (available && supabaseAdmin) {
      try {
        // Test basic connection
        const { data, error } = await supabaseAdmin
          .from('contracts')
          .select('count')
          .limit(1)

        if (error) {
          connectionTest = `ERROR: ${error.message}`
        } else {
          connectionTest = 'SUCCESS'
        }

        // Test table access
        const tables = ['organizations', 'users', 'contracts', 'contract_analyses', 'usage_events']
        for (const table of tables) {
          try {
            const { error: tableError } = await supabaseAdmin
              .from(table)
              .select('count')
              .limit(1)
            
            tableCheck[table] = tableError ? `ERROR: ${tableError.message}` : 'OK'
          } catch (err) {
            tableCheck[table] = `ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`
          }
        }
      } catch (err) {
        connectionTest = `ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`
      }
    } else {
      connectionTest = 'SKIPPED - Supabase not available'
    }

    return NextResponse.json({
      environment: envCheck,
      supabaseAvailable: available,
      adminClientExists,
      connectionTest,
      tableCheck,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
