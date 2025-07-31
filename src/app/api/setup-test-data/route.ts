import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    // Initialize results with expected keys
    let results: {
      organization: string,
      user: string,
      contractTest: string
    } = {
      organization: '',
      user: '',
      contractTest: ''
    }

    // Try to create test organization
    try {
      if (!supabaseAdmin) {
        results.organization = 'ERROR: supabaseAdmin is null'
      } else {
        const { data: org, error: orgError } = await supabaseAdmin
          .from('organizations')
          .upsert({
            id: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Test Organization',
            created_at: new Date().toISOString()
          })
          .select()
          .single()

        if (orgError) {
          console.error('Error creating organization:', orgError)
          results.organization = `ERROR: ${orgError.message}`
        } else {
          results.organization = 'SUCCESS'
        }
      }
    } catch (err) {
      results.organization = `EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`
    }

    // Try to create test user (without foreign key constraints)
    try {
      if (!supabaseAdmin) {
        results.user = 'ERROR: supabaseAdmin is null'
      } else {
        const { data: user, error: userError } = await supabaseAdmin
          .from('users')
          .upsert({
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: 'test@example.com',
            full_name: 'Test User',
            created_at: new Date().toISOString()
          })
          .select()
          .single()

        if (userError) {
          console.error('Error creating user:', userError)
          results.user = `ERROR: ${userError.message}`
        } else {
          results.user = 'SUCCESS'
        }
      }
    } catch (err) {
      results.user = `EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`
    }

    // Check what we can actually insert into contracts table
    try {
      if (!supabaseAdmin) {
        results.contractTest = 'ERROR: supabaseAdmin is null'
      } else {
        const { data: contractTest, error: contractError } = await supabaseAdmin
          .from('contracts')
          .insert({
            organization_id: '550e8400-e29b-41d4-a716-446655440001',
            uploaded_by: '550e8400-e29b-41d4-a716-446655440000',
            file_name: 'test.pdf',
            file_url: '',
            file_size: 1000,
            status: 'processing'
          })
          .select()
          .single()

        if (contractError) {
          results.contractTest = `ERROR: ${contractError.message}`
        } else {
          results.contractTest = 'SUCCESS'
          // Clean up test contract
          await supabaseAdmin.from('contracts').delete().eq('id', contractTest.id)
        }
      }
    } catch (err) {
      results.contractTest = `EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'Test data setup attempted'
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup test data' },
      { status: 500 }
    )
  }
}
