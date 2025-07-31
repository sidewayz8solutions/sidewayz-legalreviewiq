import { NextRequest, NextResponse } from 'next/server'
import { contractAnalyzer } from '@/lib/contractAnalyzer'

// Force this route to run on Node.js runtime
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Starting Hugging Face contract analysis test ===')

    console.log('Initializing Hugging Face models...')

    // Initialize the contract analyzer
    try {
      await contractAnalyzer.initialize()
      console.log('Hugging Face models initialized successfully')
    } catch (initError) {
      console.error('Failed to initialize Hugging Face models:', initError)
      return NextResponse.json({
        success: false,
        error: 'Failed to initialize AI models',
        details: initError instanceof Error ? initError.message : 'Unknown error',
        step: 'model_initialization'
      }, { status: 500 })
    }
    
    // Simple test contract text
    const testContract = `
    EMPLOYMENT AGREEMENT

    This Employment Agreement is entered into between ABC Company and John Doe.

    1. Position: Software Developer
    2. Salary: $75,000 per year
    3. Term: This agreement is for an indefinite period
    4. Termination: Either party may terminate with 30 days notice
    5. Benefits: Standard health insurance and 401k
    6. Liability: Company shall not be liable for damages exceeding $10,000
    7. Confidentiality: Employee agrees to maintain confidentiality of proprietary information
    8. Intellectual Property: All work product belongs to the company
    `

    // Analyze contract with Hugging Face models
    console.log('Starting contract analysis...')
    try {
      const analysis = await contractAnalyzer.analyzeContract(testContract)
      console.log('Contract analysis completed successfully')

      return NextResponse.json({
        success: true,
        message: 'Hugging Face contract analysis test completed successfully',
        analysis: {
          riskLevel: analysis.riskLevel,
          summary: analysis.summary,
          keyTerms: analysis.keyTerms,
          redFlags: analysis.redFlags,
          favorableTerms: analysis.favorableTerms,
          recommendations: analysis.recommendations,
          confidence: analysis.confidence
        },
        modelInfo: {
          type: 'Hugging Face Transformers',
          models: ['legal-bert-base-uncased', 'distilbart-cnn-12-6', 'twitter-roberta-base-sentiment-latest']
        },
        timestamp: new Date().toISOString()
      })

    } catch (analysisError: any) {
      console.error('Contract analysis failed:', {
        message: analysisError?.message,
        stack: analysisError?.stack,
        error: analysisError
      })

      return NextResponse.json({
        success: false,
        error: 'Contract analysis failed',
        details: analysisError?.message || 'Unknown analysis error',
        step: 'contract_analysis'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      step: 'general_error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Simple contract test endpoint using Hugging Face models.',
    usage: 'POST with no body required - uses built-in test contract',
    models: ['legal-bert-base-uncased', 'distilbart-cnn-12-6', 'twitter-roberta-base-sentiment-latest'],
    features: ['Contract section extraction', 'Risk assessment', 'Sentiment analysis', 'Summarization']
  })
}
