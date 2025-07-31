import { NextRequest, NextResponse } from 'next/server'
import { contractAnalyzer } from '@/lib/contractAnalyzer'

// Force this route to run on Node.js runtime
export const runtime = 'nodejs'

// Test endpoint that only tests the contract analyzer without database
export async function POST(request: NextRequest) {
  try {
    const { contractText } = await request.json()

    if (!contractText) {
      return NextResponse.json(
        { error: 'Missing contractText' },
        { status: 400 }
      )
    }

    console.log('Testing contract analyzer...')

    // Test the contract analyzer directly
    const analysis = await contractAnalyzer.analyzeContract(contractText)

    return NextResponse.json({
      success: true,
      analysis,
      message: 'Contract analyzer test successful'
    })

  } catch (error) {
    console.error('Contract analyzer test error:', error)
    return NextResponse.json(
      {
        error: 'Contract analyzer test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Contract Analyzer Test Endpoint',
    usage: 'POST with { "contractText": "your contract text here" }'
  })
}
