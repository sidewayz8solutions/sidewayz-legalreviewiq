import { NextResponse } from 'next/server'

// Force this route to run on Node.js runtime
export const runtime = 'nodejs'

export async function GET() {
  try {
    const envVars = {
      // Check if environment variables exist
      OPENAI_API_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
      OPENAI_API_KEY_LENGTH: process.env.OPENAI_API_KEY?.length || 0,
      OPENAI_API_KEY_PREFIX: process.env.OPENAI_API_KEY?.substring(0, 7) || 'NONE',
      
      // Check Node.js environment
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      
      // Check other env vars for comparison
      NEXT_PUBLIC_SUPABASE_URL_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY_EXISTS: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      
      // Runtime info
      RUNTIME: 'nodejs',
      TIMESTAMP: new Date().toISOString(),
    }

    // Try to create OpenAI client
    let openaiClientTest = 'NOT_TESTED'
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = (await import('openai')).default
        const client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        })
        openaiClientTest = 'CLIENT_CREATED_SUCCESSFULLY'
      } catch (error) {
        openaiClientTest = `CLIENT_ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    } else {
      openaiClientTest = 'NO_API_KEY_FOUND'
    }

    return NextResponse.json({
      success: true,
      environment: envVars,
      openaiClientTest,
      message: 'Environment debug information'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
