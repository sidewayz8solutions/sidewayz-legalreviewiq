import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Mock endpoint that simulates OpenAI analysis without making API calls
export async function POST(request: NextRequest) {
  try {
    const { contractText, userId, organizationId } = await request.json()

    if (!contractText || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required fields: contractText, organizationId' },
        { status: 400 }
      )
    }

    // Check if contract is too long
    const wordCount = contractText.split(/\s+/).length
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
        file_name: 'test-contract.txt',
        file_url: '',
        file_size: contractText.length,
        status: 'processing'
      })
      .select()
      .single()

    if (contractError) {
      console.error('Database error creating contract:', contractError)
      return NextResponse.json(
        { error: 'Failed to save contract to database' },
        { status: 500 }
      )
    }

    // Mock analysis (simulating OpenAI response)
    const analysis = {
      riskLevel: 'medium',
      summary: 'This is a standard service agreement with typical payment terms and intellectual property clauses. The contract appears to be fairly balanced but contains some areas that warrant attention.',
      keyTerms: [
        'Payment: $10,000 upfront + $5,000 on completion',
        'Term: January 1, 2024 to December 31, 2024',
        'Termination: 30 days written notice',
        'IP ownership: All work product owned by Client'
      ],
      redFlags: [
        'Limitation of liability clause may be too restrictive',
        'No specific deliverables timeline mentioned',
        'Governing law clause may favor one party'
      ],
      favorableTerms: [
        'Clear payment structure with upfront payment',
        'Intellectual property ownership clearly defined',
        'Reasonable termination clause with notice period'
      ],
      recommendations: [
        'Review limitation of liability clause for fairness',
        'Add specific milestone dates and deliverables',
        'Consider adding dispute resolution mechanism',
        'Clarify scope of work in more detail'
      ]
    }

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

    if (analysisError) {
      console.error('Database error saving analysis:', analysisError)
      return NextResponse.json(
        { error: 'Failed to save analysis to database' },
        { status: 500 }
      )
    }

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
      },
      note: 'This is a mock analysis for testing purposes'
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
