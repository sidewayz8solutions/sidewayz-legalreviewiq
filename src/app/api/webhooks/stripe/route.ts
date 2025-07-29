import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Received Stripe webhook:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id)

  const { userId, planType, organizationId } = session.metadata || {}

  if (!userId || !organizationId) {
    console.error('Missing metadata in checkout session')
    return
  }

  if (session.mode === 'payment') {
    // Handle one-time payment (pay-as-you-go)
    await supabaseAdmin
      .from('payments')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        stripe_session_id: session.id,
        amount: session.amount_total,
        currency: session.currency,
        status: 'completed',
        payment_type: 'one_time',
        product_type: session.metadata?.productType || 'single_contract'
      })
  } else if (session.mode === 'subscription') {
    // Handle subscription - create subscription record immediately for demo
    console.log('Subscription checkout completed, creating subscription record')

    // For demo purposes, create the subscription record immediately
    // In production, this would be handled by the subscription.created webhook
    if (planType && organizationId) {
      await supabaseAdmin
        .from('subscriptions')
        .upsert({
          organization_id: organizationId,
          stripe_subscription_id: session.subscription as string || `demo_sub_${Date.now()}`,
          stripe_customer_id: session.customer as string || `demo_cus_${Date.now()}`,
          plan_type: planType,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          created_at: new Date().toISOString()
        })

      console.log('Demo subscription created for organization:', organizationId)
    }
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id)
  
  if (invoice.subscription) {
    // Update subscription payment status
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_start: new Date(invoice.period_start * 1000).toISOString(),
        current_period_end: new Date(invoice.period_end * 1000).toISOString()
      })
      .eq('stripe_subscription_id', invoice.subscription)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id)
  
  const { organizationId, planType } = subscription.metadata || {}
  
  if (!organizationId || !planType) {
    console.error('Missing metadata in subscription')
    return
  }

  // Create subscription record
  await supabaseAdmin
    .from('subscriptions')
    .insert({
      organization_id: organizationId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      plan_type: planType,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
    })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)
  
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)
  
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)
}
