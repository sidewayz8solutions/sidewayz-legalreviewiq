'use client'

import { useState } from 'react'
import { Check, Star, Sparkles, ArrowRight, Shield, Clock, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import styles from './pricing.module.css'

const TESTIMONIAL = {
  quote: "This tool saved us $2,000 in legal fees on our vendor contract. The risk analysis was spot-on.",
  author: "Sarah Chen",
  role: "CEO, TechStartup Inc",
  saved: "$2,000"
}

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planType: string) => {
    setLoading(planType)

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          organizationId: 'demo-org', // Get from auth in production
          userId: 'demo-user',
          successUrl: `${window.location.origin}/dashboard/success`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      })

      const { sessionUrl } = await response.json()
      window.location.href = sessionUrl
    } catch (error) {
      toast.error('Failed to start checkout')
      setLoading(null)
    }
  }

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <Sparkles size={24} />
            Legal Review IQ
          </Link>
          <div className={styles.navLinks}>
            <Link href="/#features" className={styles.navLink}>✨ Features</Link>
            <Link href="/how-it-works" className={styles.navLink}>🚀 How it Works</Link>
            <Link href="/pricing" className={styles.navLink}>💎 Pricing</Link>
            <Link href="/dashboard/contracts/upload" className={styles.ctaButton}>
              Try Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Simple, Transparent Pricing
          </h1>
          <p className={styles.heroSubtitle}>
            Start with pay-per-contract or save with a monthly plan
          </p>
          <div className={styles.badge}>
            <Star size={20} />
            Save 50% with annual billing
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <div className={styles.pricingSection}>
        <div className={styles.pricingGrid}>
          {/* Pay As You Go */}
          <div className={styles.pricingCard}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Pay As You Go</h3>
              <p className={styles.cardDescription}>Perfect for occasional use</p>

              <div className={styles.price}>
                <span className={styles.priceAmount}>$10</span>
                <span className={styles.priceUnit}> / contract</span>
              </div>

              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Complete contract analysis</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Risk assessment & scoring</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Plain English explanations</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Export PDF report</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => handleCheckout('payAsYouGo')}
                disabled={loading === 'payAsYouGo'}
                className={styles.ctaButton}
              >
                {loading === 'payAsYouGo' ? 'Loading...' : 'Analyze One Contract'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </div>
          </div>

          {/* Starter Plan - Most Popular */}
          <div className={`${styles.pricingCard} ${styles.popular}`}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Starter</h3>
              <p className={styles.cardDescription}>For growing businesses</p>

              <div className={styles.price}>
                <span className={styles.priceAmount}>$49</span>
                <span className={styles.priceUnit}> / month</span>
              </div>

              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span><strong>10 contracts</strong> per month</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Unlimited team members</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Contract comparison tool</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Email support</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Bulk export</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => handleCheckout('starter')}
                disabled={loading === 'starter'}
                className={styles.ctaButton}
              >
                {loading === 'starter' ? 'Loading...' : 'Start Free Trial'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </div>
          </div>

          {/* Professional Plan */}
          <div className={styles.pricingCard}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Professional</h3>
              <p className={styles.cardDescription}>For larger teams</p>

              <div className={styles.price}>
                <span className={styles.priceAmount}>$149</span>
                <span className={styles.priceUnit}> / month</span>
              </div>

              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span><strong>50 contracts</strong> per month</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Everything in Starter</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>API access</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Priority support</span>
                </li>
                <li className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={20} />
                  <span>Custom integrations</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => handleCheckout('professional')}
                disabled={loading === 'professional'}
                className={styles.ctaButton}
              >
                {loading === 'professional' ? 'Loading...' : 'Start Free Trial'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className={styles.valueSection}>
          <h2 className={styles.valueTitle}>
            Why Legal Review IQ is Essential for Your Business
          </h2>
          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <Shield size={32} />
              </div>
              <h3 className={styles.valueCardTitle}>Protect Your Business</h3>
              <p className={styles.valueCardText}>
                Identify hidden risks, unfavorable terms, and potential liabilities before you sign.
                Our AI catches what human reviewers often miss, saving you from costly legal disputes.
              </p>
              <div className={styles.valueStats}>
                <span className={styles.statNumber}>95%</span>
                <span className={styles.statLabel}>Risk Detection Accuracy</span>
              </div>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <Clock size={32} />
              </div>
              <h3 className={styles.valueCardTitle}>Save Time & Money</h3>
              <p className={styles.valueCardText}>
                Get comprehensive contract analysis in under 30 seconds instead of waiting days
                for legal review. Reduce legal fees by 80% while making faster business decisions.
              </p>
              <div className={styles.valueStats}>
                <span className={styles.statNumber}>30 sec</span>
                <span className={styles.statLabel}>Average Analysis Time</span>
              </div>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <TrendingUp size={32} />
              </div>
              <h3 className={styles.valueCardTitle}>Make Better Decisions</h3>
              <p className={styles.valueCardText}>
                Understand complex legal language with plain-English explanations. Get actionable
                recommendations and negotiation strategies to improve your contract terms.
              </p>
              <div className={styles.valueStats}>
                <span className={styles.statNumber}>10x</span>
                <span className={styles.statLabel}>Faster Understanding</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={styles.faqSection}>
          <h2 className={styles.faqTitle}>
            Frequently Asked Questions
          </h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How accurate is the AI analysis?</h3>
              <p className={styles.faqAnswer}>
                Our AI is trained on thousands of contracts and identifies risks with 95% accuracy.
                However, we always recommend professional legal review for high-value contracts.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Can I cancel anytime?</h3>
              <p className={styles.faqAnswer}>
                Yes! You can cancel your subscription at any time. You'll continue to have access
                until the end of your billing period.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Is my data secure?</h3>
              <p className={styles.faqAnswer}>
                Absolutely. All contracts are encrypted at rest and in transit. We automatically
                delete documents 30 days after analysis, and you can delete them anytime.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What file types do you support?</h3>
              <p className={styles.faqAnswer}>
                We currently support PDF and Word documents (.docx). Most contracts are shared
                in these formats. More formats coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerGrid}>
            {/* Company Info */}
            <div className={styles.footerSection}>
              <div className={`${styles.logo} ${styles.footerLogo}`}>
                <Sparkles size={24} />
                Legal Review IQ
              </div>
              <p className={styles.footerDescription}>
                AI-powered contract analysis that helps businesses understand legal documents, identify risks, and make informed decisions in seconds.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>Twitter</a>
                <a href="#" className={styles.socialLink}>LinkedIn</a>
                <a href="#" className={styles.socialLink}>GitHub</a>
              </div>
            </div>

            {/* Product */}
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>Product</h3>
              <div className={styles.footerLinks}>
                <Link href="/#features" className={styles.footerLink}>Features</Link>
                <Link href="/how-it-works" className={styles.footerLink}>How it Works</Link>
                <Link href="/demo" className={styles.footerLink}>Sample Analysis</Link>
                <Link href="/pricing" className={styles.footerLink}>Pricing</Link>
                <Link href="/dashboard/contracts/upload" className={styles.footerLink}>Try Free</Link>
              </div>
            </div>

            {/* Legal */}
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>Legal</h3>
              <div className={styles.footerLinks}>
                <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
                <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                <a href="#" className={styles.footerLink}>Cookie Policy</a>
                <a href="#" className={styles.footerLink}>GDPR Compliance</a>
              </div>
            </div>

            {/* Support */}
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>Support</h3>
              <div className={styles.footerLinks}>
                <Link href="/contact" className={styles.footerLink}>Contact Support</Link>
                <a href="mailto:support@legalreviewiq.com" className={styles.footerLink}>Email Us</a>
                <a href="tel:+12253019908" className={styles.footerLink}>Call Us</a>
                <a href="#" className={styles.footerLink}>Help Center</a>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div className={styles.footerCopyright}>
              © 2024 Legal Review IQ. All rights reserved.
            </div>
            <div className={styles.footerMeta}>
              <span>Made with ❤️ for businesses worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
