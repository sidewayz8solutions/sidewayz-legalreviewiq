import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'
import pdfParse from 'pdf-parse'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

// This function handles the contract analysis
export async function POST(request: NextRequest) {
  try {
    // Extract the contract text from the uploaded file
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const organizationId = formData.get('organizationId') as string

    if (!file || !userId || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert file to buffer for processing
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extract text based on file type
    let extractedText = ''

    if (file.type === 'application/pdf') {
      const pdfData = await pdfParse(buffer)
      extractedText = pdfData.text
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Handle Word documents
      const mammoth = require('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or DOCX.' },
        { status: 400 }
      )
    }

    // Check if contract is too long (important for API costs)
    const wordCount = extractedText.split(/\s+/).length
    if (wordCount > 10000) {
      return NextResponse.json(
        { error: 'Contract too long. Maximum 10,000 words.' },
        { status: 400 }
      )
    }

    // Create contract record in database
    const { data: contract, error: contractError } = await supabaseAdmin
      .from('contracts')
      .insert({
        organization_id: organizationId,
        uploaded_by: userId,
        file_name: file.name,
        file_url: '', // We'll update this after upload
        file_size: file.size,
        status: 'processing'
      })
      .select()
      .single()

    if (contractError) throw contractError

    // Analyze contract with GPT-4
    const analysisPrompt = `
    You are an expert contract analyst. Analyze the following contract and provide:

    1. Risk Level: Assess overall risk (low/medium/high/critical)
    2. Summary: 2-3 sentence overview of the contract
    3. Key Terms: Important provisions (payment terms, duration, termination)
    4. Red Flags: Concerning clauses that favor the other party
    5. Favorable Terms: Clauses that protect our interests
    6. Recommendations: Specific actions to take

    Focus on practical business implications, not legal theory.
    Be direct about risks. Use plain English.

    Contract text:
    ${extractedText}

    Respond in JSON format with keys: riskLevel, summary, keyTerms, redFlags, favorableTerms, recommendations
    `

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: analysisPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for more consistent analysis
      max_tokens: 2000
    })

    const analysis = JSON.parse(completion.choices[0].message.content!)

    // Calculate risk score (0-100)
    const riskScore = calculateRiskScore(analysis)

    // Save analysis results
    const { error: analysisError } = await supabaseAdmin
      .from('contract_analyses')
      .insert({
        contract_id: contract.id,
        risk_level: analysis.riskLevel,
        summary: analysis.summary,
        key_terms: analysis.keyTerms,
        red_flags: analysis.redFlags,
        favorable_terms: analysis.favorableTerms,
        recommendations: analysis.recommendations
      })

    if (analysisError) throw analysisError

    // Update contract status
    await supabaseAdmin
      .from('contracts')
      .update({
        status: 'completed',
        risk_score: riskScore,
        analyzed_at: new Date().toISOString()
      })
      .eq('id', contract.id)

    // Track usage for billing
    await supabaseAdmin
      .from('usage_events')
      .insert({
        organization_id: organizationId,
        event_type: 'contract_analysis',
        metadata: {
          contract_id: contract.id,
          word_count: wordCount,
          risk_level: analysis.riskLevel
        }
      })

    return NextResponse.json({
      success: true,
      contractId: contract.id,
      analysis: {
        ...analysis,
        riskScore
      }
    })

  } catch (error) {
    console.error('Contract analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze contract' },
      { status: 500 }
    )
  }
}

// Helper function to calculate numerical risk score
function calculateRiskScore(analysis: any): number {
  let score = 0

  // Base score from risk level
  const riskLevelScores = {
    low: 20,
    medium: 50,
    high: 75,
    critical: 90
  }
  score = riskLevelScores[analysis.riskLevel as keyof typeof riskLevelScores] || 50

  // Adjust based on red flags count
  const redFlagCount = Array.isArray(analysis.redFlags) ? analysis.redFlags.length : 0
  score += Math.min(redFlagCount * 5, 25)

  // Reduce score for favorable terms
  const favorableCount = Array.isArray(analysis.favorableTerms) ? analysis.favorableTerms.length : 0
  score -= Math.min(favorableCount * 3, 15)

  return Math.max(0, Math.min(100, score))
}
