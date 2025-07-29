import { NextRequest, NextResponse } from 'next/server'
import { updateDemoUserStatus } from '@/lib/demo-user-state'

export async function POST(request: NextRequest) {
  try {
    const { isPremium } = await request.json()

    console.log('Setting demo user premium status to:', isPremium)

    if (isPremium) {
      // Set user as premium with active subscription
      updateDemoUserStatus({
        isPremium: true,
        isActiveSubscription: true,
        email: 'premium-user@example.com',
        subscriptionStatus: 'active',
        planType: 'professional',
        trialEnd: null,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      })
    } else {
      // Set user as free
      updateDemoUserStatus({
        isPremium: false,
        isActiveSubscription: false,
        email: 'demo@example.com',
        subscriptionStatus: null,
        planType: null,
        trialEnd: null,
        currentPeriodEnd: null
      })
    }

    return NextResponse.json({
      success: true,
      message: isPremium ? 'Demo user set to premium' : 'Demo user set to free'
    })

  } catch (error) {
    console.error('Demo setup error:', error)
    return NextResponse.json(
      { error: 'Failed to set demo user status' },
      { status: 500 }
    )
  }
}
