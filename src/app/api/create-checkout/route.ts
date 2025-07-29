import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

// Define your pricing plans
const PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.NODE_ENV === 'production'
      ? 'price_production_starter'
      : 'price_1234567890', // Create in Stripe dashboard
    features: {
      contractsPerMonth: 10,
      aiCredits: 10,
      support: 'email'
    }
  },
  professional: {
    name: 'Professional',
    priceId: process.env.NODE_ENV === 'production'
      ? 'price_production_pro'
      : 'price_0987654321',
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

    if (!customerId) {
      // Create new Stripe customer
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('email, full_name')
        .eq('id', userId)
        .single()

      const customer = await stripe.customers.create({
        email: userData?.email,
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
    }

    // Create checkout session for subscription
    const plan = PLANS[planType as keyof typeof PLANS]
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
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          organizationId,
          planType
        }
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
