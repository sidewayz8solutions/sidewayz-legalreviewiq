import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseAvailable } from '@/lib/supabase'
import { contractAnalyzer } from '@/lib/contractAnalyzer'

// Force this route to run on Node.js runtime
export const runtime = 'nodejs'

// This function handles the contract analysis
export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is available
    if (!isSupabaseAvailable() || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service is not available. Please check your Supabase configuration.' },
        { status: 503 }
      )
    }

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

    // Check if file is PDF (by MIME type or extension)
    const fileName = file.name.toLowerCase()
    const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf')

    if (isPdf) {
      try {
        console.log('Processing PDF file:', {
          name: file.name,
          type: file.type,
          size: file.size
        })

        // Dynamic import to avoid build-time issues
        const pdfParse = (await import('pdf-parse')).default
        const pdfData = await pdfParse(buffer)
        extractedText = pdfData.text

        console.log('PDF text extraction result:', {
          textLength: extractedText?.length || 0,
          hasText: !!extractedText?.trim()
        })

        if (!extractedText || extractedText.trim().length === 0) {
          return NextResponse.json(
            { error: 'Could not extract text from PDF. The file may be corrupted, password-protected, or contain only images.' },
            { status: 400 }
          )
        }
      } catch (pdfError) {
        console.error('PDF parsing error:', {
          error: pdfError,
          message: pdfError instanceof Error ? pdfError.message : 'Unknown error',
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        })
        return NextResponse.json(
          {
            error: 'Failed to parse PDF file. Please ensure the file is a valid, unprotected PDF document.',
            details: pdfError instanceof Error ? pdfError.message : 'Unknown parsing error'
          },
          { status: 400 }
        )
      }
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      try {
        console.log('Processing DOCX file:', {
          name: file.name,
          type: file.type,
          size: file.size
        })

        // Handle Word documents - also use dynamic import
        const mammoth = await import('mammoth')
        const result = await mammoth.extractRawText({ buffer })
        extractedText = result.value

        console.log('DOCX text extraction result:', {
          textLength: extractedText?.length || 0,
          hasText: !!extractedText?.trim()
        })

        if (!extractedText || extractedText.trim().length === 0) {
          return NextResponse.json(
            { error: 'Could not extract text from Word document. The file may be corrupted or password-protected.' },
            { status: 400 }
          )
        }
      } catch (docxError) {
        console.error('DOCX parsing error:', {
          error: docxError,
          message: docxError instanceof Error ? docxError.message : 'Unknown error',
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        })
        return NextResponse.json(
          {
            error: 'Failed to parse Word document. Please ensure the file is a valid DOCX document.',
            details: docxError instanceof Error ? docxError.message : 'Unknown parsing error'
          },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        {
          error: 'Unsupported file type. Please upload a PDF (.pdf) or Word document (.docx).',
          receivedType: file.type,
          fileName: file.name
        },
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

    // Create contract record in database (skip uploaded_by to avoid foreign key constraint)
    const { data: contract, error: contractError } = await supabaseAdmin
      .from('contracts')
      .insert({
        organization_id: organizationId,
        file_name: file.name,
        file_url: '', // We'll update this after upload
        file_size: file.size,
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

    // Analyze contract with Hugging Face models
    console.log('Starting contract analysis with Hugging Face models...')

    let analysis
    try {
      analysis = await contractAnalyzer.analyzeContract(extractedText)
      console.log('Contract analysis completed successfully')

      // Ensure analysis has all required fields
      if (!analysis.riskLevel || !analysis.summary) {
        throw new Error('Incomplete analysis result')
      }

    } catch (analysisError: any) {
      console.error('Contract analysis error:', {
        message: analysisError?.message,
        stack: analysisError?.stack,
        error: analysisError
      })

      return NextResponse.json(
        {
          error: 'Failed to analyze contract with AI models. Please try again.',
          details: analysisError?.message || 'Unknown analysis error',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
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
      }
    })

  } catch (error) {
    console.error('Contract analysis error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    })

    return NextResponse.json(
      {
        error: 'Failed to analyze contract',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
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
