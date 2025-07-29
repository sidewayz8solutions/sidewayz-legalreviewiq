import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

// Define your pricing plans
const PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_1234567890',
    features: {
      contractsPerMonth: 10,
      aiCredits: 10,
      support: 'email'
    }
  },
  professional: {
    name: 'Professional',
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_0987654321',
    features: {
      contractsPerMonth: 50,
      aiCredits: 50,
      support: 'priority'
    }
  },
  payAsYouGo: {
    name: 'Pay As You Go',
    pricePerContract: 10 // $10 per contract
  }
}

export async function POST(request: NextRequest) {
  try {
    const { planType, organizationId, userId, successUrl, cancelUrl } = await request.json()

    // Validate required fields
    if (!planType || !organizationId || !userId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating checkout session for:', { planType, organizationId, userId })

    // For demo purposes, check if we have real Stripe keys
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_demo')) {
      // Return a demo success URL for testing
      console.log('Demo mode: No real Stripe keys configured')
      return NextResponse.json({
        sessionUrl: `${successUrl}?demo=true&plan=${planType}`
      })
    }

    // For pay-as-you-go, create a one-time payment
    if (planType === 'payAsYouGo') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Contract Analysis',
              description: 'AI-powered contract review and risk assessment'
            },
            unit_amount: 1000 // $10.00
          },
          quantity: 1
        }],
        mode: 'payment',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          organizationId,
          userId,
          productType: 'single_contract'
        }
      })

      return NextResponse.json({ sessionUrl: session.url })
    }

    // For subscriptions, create or retrieve customer
    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('stripe_customer_id')
      .eq('id', organizationId)
      .single()

    let customerId = org?.stripe_customer_id
    let userEmail = null;

    if (!customerId) {
      // Create new Stripe customer
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('email, full_name')
        .eq('id', userId)
        .single()

      userEmail = userData?.email;
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userData?.full_name,
        metadata: {
          organizationId
        }
      })

      customerId = customer.id

      // Save customer ID
      await supabaseAdmin
        .from('organizations')
        .update({ stripe_customer_id: customerId })
        .eq('id', organizationId)
    } else {
      // Get user email for existing customer
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('id', userId)
        .single()
      
      userEmail = userData?.email;
    }

    // Create checkout session for subscription
    const plan = PLANS[planType as keyof typeof PLANS];

    // Check if the plan has a priceId (not payAsYouGo)
    if (!('priceId' in plan)) {
      return NextResponse.json(
        { error: 'Invalid plan type for subscription' },
        { status: 400 }
      )
    }

    // Validate that we have a real price ID
    if (plan.priceId.startsWith('price_123') || plan.priceId.startsWith('price_098')) {
      return NextResponse.json(
        { error: 'Stripe price IDs not configured. Please set STRIPE_STARTER_PRICE_ID and STRIPE_PROFESSIONAL_PRICE_ID environment variables.' },
        { status: 500 }
      )
    }
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: plan.priceId,
        quantity: 1
      }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      billing_address_collection: 'auto',
      customer_email: userEmail, // Now properly defined
      subscription_data: {
        trial_period_days: 3,
        metadata: {
          organizationId,
          planType
        }
      },
      metadata: {
        userId: userId,
        planType: planType
      }
    })

    return NextResponse.json({ sessionUrl: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
