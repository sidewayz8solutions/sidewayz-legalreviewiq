import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Force this route to run on Node.js runtime
export const runtime = 'nodejs'

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    
    // Check if API key exists
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY environment variable not found',
        details: 'The environment variable is not set'
      })
    }
    
    // Check API key format
    if (!apiKey.startsWith('sk-')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid API key format',
        details: 'OpenAI API keys should start with "sk-"',
        keyPrefix: apiKey.substring(0, 10) + '...'
      })
    }
    
    // Log key info (safely)
    console.log('API Key prefix:', apiKey.substring(0, 20) + '...')
    console.log('API Key length:', apiKey.length)
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey
    })
    
    // Make a simple test call
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "API key test successful"' }],
      max_tokens: 10
    })
    
    return NextResponse.json({
      success: true,
      message: 'OpenAI API key is working correctly',
      response: completion.choices[0].message.content,
      model: completion.model,
      usage: completion.usage
    })
    
  } catch (error: any) {
    console.error('OpenAI API test error:', error)

    // Provide detailed error information
    let errorDetails: {
      success: boolean
      error: string
      message: any
      status: any
      type: any
      code: any
      guidance?: string
      possibleCauses?: string[]
    } = {
      success: false,
      error: 'OpenAI API call failed',
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code
    }
    
    // Add specific guidance based on error type
    if (error.status === 401) {
      errorDetails = {
        ...errorDetails,
        guidance: 'API key is invalid, expired, or not properly formatted. Check your OpenAI dashboard.',
        possibleCauses: [
          'API key is incorrect or has typos',
          'API key has expired',
          'API key doesn\'t have proper permissions',
          'Billing issue on OpenAI account'
        ]
      }
    } else if (error.status === 429) {
      errorDetails = {
        ...errorDetails,
        guidance: 'Rate limit exceeded or quota exceeded',
        possibleCauses: [
          'Too many requests',
          'Monthly quota exceeded',
          'No credits remaining on account'
        ]
      }
    } else if (error.status === 402) {
      errorDetails = {
        ...errorDetails,
        guidance: 'Payment required - billing issue',
        possibleCauses: [
          'No payment method on file',
          'Credit card expired',
          'Account suspended due to billing'
        ]
      }
    }
    
    return NextResponse.json(errorDetails, { status: 500 })
  }
}
