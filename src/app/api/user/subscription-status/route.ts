import { NextRequest, NextResponse } from 'next/server'
import { getDemoUserStatus } from '@/lib/demo-user-state'

export async function GET(request: NextRequest) {
  try {
    const userStatus = getDemoUserStatus()
    console.log('Getting user subscription status:', userStatus)

    return NextResponse.json(userStatus)

  } catch (error) {
    console.error('Subscription status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
