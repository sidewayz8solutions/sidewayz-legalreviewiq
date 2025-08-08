import mammoth from 'mammoth';
// src/app/api/analyze-contract/route.ts
import {
  NextRequest,
  NextResponse,
} from 'next/server';
import pdfParse from 'pdf-parse';

import { contractAnalyzer } from '@/lib/contractAnalyzer';
import { supabaseAdmin } from '@/lib/supabase';

// Force this route to run on Node.js runtime for file processing
export const runtime = 'nodejs'

// Increase max duration for AI processing (Vercel Pro/Enterprise only)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OpenAI API key not configured. Using fallback analysis.');
    }

    // Check if Supabase is available
    if (!supabaseAdmin) {
      console.error('❌ Supabase not configured');
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
        { error: 'Missing required fields: file and organizationId are required' },
        { status: 400 }
      )
    }

    console.log(`📄 Processing contract: ${file.name} (${file.size} bytes)`);

    // Validate file type
    const fileName = file.name.toLowerCase()
    const mimeType = file.type.toLowerCase()
    
    const isPdf = mimeType === 'application/pdf' || fileName.endsWith('.pdf')
    const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                   fileName.endsWith('.docx')
    const isDoc = mimeType === 'application/msword' || fileName.endsWith('.doc')
    const isTxt = mimeType === 'text/plain' || fileName.endsWith('.txt')

    if (!isPdf && !isDocx && !isDoc && !isTxt) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported formats: PDF, Word (.docx, .doc), and Text (.txt)' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB` },
        { status: 400 }
      )
    }

    // Extract text from file
    let contractText: string = '';
    let extractionError: string | null = null;

    try {
      if (isPdf) {
        console.log('📑 Extracting text from PDF...');
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const pdfData = await pdfParse(buffer)
        contractText = pdfData.text
        console.log(`✅ Extracted ${contractText.length} characters from PDF`);
      } else if (isDocx) {
        console.log('📝 Extracting text from DOCX...');
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const result = await mammoth.extractRawText({ buffer })
        contractText = result.value
        console.log(`✅ Extracted ${contractText.length} characters from DOCX`);
      } else if (isTxt) {
        console.log('📄 Reading text file...');
        contractText = await file.text()
        console.log(`✅ Read ${contractText.length} characters from text file`);
      } else {
        // For .doc files, we can't process them directly
        extractionError = 'Old Word format (.doc) detected. Please save as .docx or PDF for best results.';
        contractText = await file.text(); // Try to read as text
      }
    } catch (error) {
      console.error('❌ File extraction error:', error);
      extractionError = `Failed to extract text from ${file.name}. The file may be corrupted or password-protected.`;
      
      // Try to read as plain text as last resort
      try {
        contractText = await file.text();
      } catch {
        return NextResponse.json(
          { error: extractionError },
          { status: 400 }
        )
      }
    }

    // Clean and validate contract text
    contractText = contractText.trim();
    
    // Remove excessive whitespace
    contractText = contractText.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n');

    if (!contractText || contractText.length < 100) {
      return NextResponse.json(
        { error: 'Contract text is too short or empty. Minimum 100 characters required. Please ensure the document contains readable text.' },
        { status: 400 }
      )
    }

    const wordCount = contractText.split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount > 10000) {
      console.warn(`⚠️ Large contract detected: ${wordCount} words. Truncating for analysis...`);
      // Truncate to first 10000 words for analysis
      const words = contractText.split(/\s+/);
      contractText = words.slice(0, 10000).join(' ');
    }

    console.log(`📊 Contract stats: ${wordCount} words, ${contractText.length} characters`);

    // Store contract in database
    const { data: contract, error: dbError } = await supabaseAdmin
      .from('contracts')
      .insert({
        organization_id: organizationId,
        uploaded_by: userId || null,
        file_name: file.name,
        file_url: '',
        file_size: file.size,
        status: 'processing'
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to store contract in database. Please try again.' },
        { status: 500 }
      )
    }

    console.log(`💾 Contract saved with ID: ${contract.id}`);

    // Analyze contract with AI
    console.log('🤖 Starting AI contract analysis...');
    let analysis;
    let analysisStartTime = Date.now();

    try {
      analysis = await contractAnalyzer.analyzeContract(contractText);
      const analysisTime = ((Date.now() - analysisStartTime) / 1000).toFixed(2);
      console.log(`✅ Contract analysis completed in ${analysisTime}s`);

      // Validate analysis results
      if (!analysis.riskLevel || !analysis.summary) {
        throw new Error('Incomplete analysis result received');
      }

    } catch (analysisError: any) {
      console.error('❌ Contract analysis error:', analysisError);

      // Update contract status to failed
      await supabaseAdmin
        .from('contracts')
        .update({ 
          status: 'failed',
          error_message: analysisError?.message 
        })
        .eq('id', contract.id)

      return NextResponse.json(
        {
          error: 'Failed to analyze contract. Our AI service may be temporarily unavailable.',
          details: process.env.NODE_ENV === 'development' ? analysisError?.message : undefined
        },
        { status: 500 }
      )
    }

    // Calculate risk score (0-100)
    const riskScore = calculateRiskScore(analysis.riskLevel);

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
        analyzed_at: new Date().toISOString(),
        analysis_method: process.env.OPENAI_API_KEY ? 'openai-gpt4' : 'rule-based'
      })

    if (analysisError) {
      console.error('⚠️ Failed to store analysis:', analysisError);
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
        user_id: userId || null,
        event_type: 'contract_analysis',
        credits_used: Math.ceil(wordCount / 1000), // 1 credit per 1000 words
        metadata: {
          contract_id: contract.id,
          word_count: wordCount,
          risk_level: analysis.riskLevel,
          analysis_method: process.env.OPENAI_API_KEY ? 'openai-gpt4' : 'rule-based'
        }
      })

    console.log('✅ Analysis complete and saved');

    return NextResponse.json({
      success: true,
      contractId: contract.id,
      analysis: {
        ...analysis,
        riskScore,
        wordCount,
        processingTime: ((Date.now() - analysisStartTime) / 1000).toFixed(2),
        extractionWarning: extractionError
      }
    })

  } catch (error) {
    console.error('❌ Unexpected error in contract analysis:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred during contract analysis',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// Helper function to calculate numerical risk score
function calculateRiskScore(riskLevel: string): number {
  const scores = {
    'low': 25,
    'medium': 50,
    'high': 75,
    'critical': 90
  };
  return scores[riskLevel as keyof typeof scores] || 50;
}

// GET endpoint for testing
export async function GET() {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  return NextResponse.json({
    status: 'ready',
    message: 'Contract Analysis API',
    version: '2.0',
    configuration: {
      ai_enabled: hasOpenAI,
      database_enabled: hasSupabase,
      analysis_method: hasOpenAI ? 'openai-gpt4' : 'rule-based-fallback'
    },
    usage: {
      method: 'POST',
      body: 'FormData with: file (PDF/DOCX/TXT), userId (optional), organizationId (required)',
      supportedFormats: ['PDF', 'DOCX', 'DOC', 'TXT'],
      maxFileSize: '10MB',
      maxWords: 10000
    },
    endpoints: {
      test: '/api/test-analyze',
      analyze: '/api/analyze-contract',
      health: '/api/health'
    }
  });
}