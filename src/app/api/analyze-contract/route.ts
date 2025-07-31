import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { contractAnalyzer } from '@/lib/contractAnalyzer'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'

// Force this route to run on Node.js runtime
export const runtime = 'nodejs'

// Main contract analysis endpoint that handles file uploads
export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service is not available. Please check your Supabase configuration.' },
        { status: 503 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const organizationId = formData.get('organizationId') as string

    // Validate required fields
    if (!file || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    const fileName = file.name.toLowerCase()
    const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf')
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')

    if (!isPdf && !isDocx) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or Word document.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Extract text from file
    let contractText: string
    try {
      if (isPdf) {
        console.log('Processing PDF file...')
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const pdfData = await pdfParse(buffer)
        contractText = pdfData.text
        console.log(`Extracted ${contractText.length} characters from PDF`)
      } else if (isDocx) {
        console.log('Processing DOCX file...')
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const result = await mammoth.extractRawText({ buffer })
        contractText = result.value
        console.log(`Extracted ${contractText.length} characters from DOCX`)
      } else {
        // Fallback to treating as text file
        contractText = await file.text()
        console.log(`Read ${contractText.length} characters from text file`)
      }
    } catch (error) {
      console.error('File processing error:', error)
      return NextResponse.json(
        { error: 'Failed to process file. Please ensure it is a valid document.' },
        { status: 400 }
      )
    }

    // Validate contract text
    if (!contractText || contractText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Contract text is too short or empty. Minimum 100 characters required.' },
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

    console.log(`Processing contract: ${file.name} (${wordCount} words)`)

    // Store contract in database
    const { data: contract, error: dbError } = await supabaseAdmin
      .from('contracts')
      .insert({
        organization_id: organizationId,
        user_id: userId || null,
        filename: file.name,
        file_size: file.size,
        content: contractText,
        word_count: wordCount,
        status: 'processing',
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to store contract in database' },
        { status: 500 }
      )
    }

    // Analyze contract
    console.log('Starting contract analysis...')
    let analysis
    try {
      analysis = await contractAnalyzer.analyzeContract(contractText)
      console.log('Contract analysis completed successfully')

      // Ensure analysis has all required fields
      if (!analysis.riskLevel || !analysis.summary) {
        throw new Error('Incomplete analysis result')
      }

    } catch (analysisError: any) {
      console.error('Contract analysis error:', analysisError)

      // Update contract status to failed
      await supabaseAdmin
        .from('contracts')
        .update({ status: 'failed' })
        .eq('id', contract.id)

      return NextResponse.json(
        {
          error: 'Failed to analyze contract. Please try again.',
          details: analysisError?.message || 'Unknown analysis error'
        },
        { status: 500 }
      )
    }

    // Calculate risk score (0-100)
    const riskScore = analysis.riskLevel === 'critical' ? 90
      : analysis.riskLevel === 'high' ? 70
      : analysis.riskLevel === 'medium' ? 40
      : 20

    // Store analysis results
    const { error: analysisError } = await supabaseAdmin
      .from('contract_analyses')
      .insert({
        contract_id: contract.id,
        risk_level: analysis.riskLevel,
        risk_score: riskScore,
        summary: analysis.summary,
        key_terms: analysis.keyTerms,
        red_flags: analysis.redFlags,
        favorable_terms: analysis.favorableTerms,
        recommendations: analysis.recommendations,
        confidence_score: analysis.confidence,
        analyzed_at: new Date().toISOString()
      })

    if (analysisError) {
      console.error('Failed to store analysis:', analysisError)
      // Continue anyway - we have the analysis
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

export async function GET() {
  return NextResponse.json({
    message: 'Contract Analysis API',
    usage: 'POST with FormData containing file, userId (optional), and organizationId',
    supportedFormats: ['PDF', 'DOCX'],
    maxFileSize: '10MB',
    maxWords: 10000
  })
}