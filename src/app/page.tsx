'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Shield, DollarSign, FileSearch, Sparkles } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { useUser } from '@/contexts/UserContext'
import styles from './landing.module.css'

// Real social proof - update with actual numbers as you grow
const SOCIAL_PROOF = {
  contractsAnalyzed: 127,
  moneySaved: 45000,
  timesSaved: 380
}

function LandingPageContent() {
  const { setPremiumUser } = useUser()
  const searchParams = useSearchParams()
  const [isUpdatingPremium, setIsUpdatingPremium] = useState(false)

  useEffect(() => {
    // Check if user just completed premium purchase
    if (searchParams.get('premium') === 'true') {
      console.log('Premium parameter detected, setting user as premium...')
      setIsUpdatingPremium(true)

      // Set user as premium immediately
      setPremiumUser()

      // Show success message for 2 seconds
      setTimeout(() => {
        setIsUpdatingPremium(false)
        // Remove the parameter from URL
        window.history.replaceState({}, '', '/')
      }, 2000)
    }
  }, [searchParams, setPremiumUser])

  return (
    <>
      <Navigation />

      {/* Premium Update Success Message */}
      {isUpdatingPremium && (
        <div style={{
          position: 'fixed',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#10b981',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '0.5rem',
          zIndex: 1000,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          🎉 Welcome to Premium! Updating your navigation...
        </div>
      )}

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Understand Any Contract in 30 Seconds
          </h1>
          
          <p className={styles.heroSubtitle}>
            AI-powered contract analysis that explains risks, highlights red flags,
            and saves you <strong>thousands in legal fees</strong>. No legal degree required.
          </p>

          {/* CTA Buttons */}
          <div className={styles.heroButtons}>
            <Link href="/dashboard/contracts/upload" className={styles.primaryButton}>
              Analyze Your First Contract Free
              <ArrowRight size={20} />
            </Link>
            <Link href="/demo" className={styles.secondaryButton}>
              See Sample Analysis
              <FileSearch size={20} />
            </Link>
          </div>

          {/* Social Proof */}
          <div className={styles.socialProof}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {SOCIAL_PROOF.contractsAnalyzed}+
              </div>
              <div className={styles.statLabel}>Contracts Analyzed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                ${SOCIAL_PROOF.moneySaved.toLocaleString()}+
              </div>
              <div className={styles.statLabel}>Saved in Legal Fees</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {SOCIAL_PROOF.timesSaved}h+
              </div>
              <div className={styles.statLabel}>Time Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionTitle}>
          Everything You Need to Stay Protected
        </div>
        <div className={styles.sectionSubtitle}>
          Professional contract analysis made simple with cutting-edge AI technology
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <FileSearch size={40} />
            </div>
            <h3 className={styles.cardTitle}>
              Instant Analysis
            </h3>
            <p className={styles.cardDescription}>
              Upload your contract and get comprehensive results in under 30 seconds with our lightning-fast AI
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Shield size={40} />
            </div>
            <h3 className={styles.cardTitle}>
              Risk Detection
            </h3>
            <p className={styles.cardDescription}>
              AI identifies unfavorable terms, missing protections, and potential liabilities before they hurt you
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <DollarSign size={40} />
            </div>
            <h3 className={styles.cardTitle}>
              Save Money
            </h3>
            <p className={styles.cardDescription}>
              Avoid expensive legal reviews for routine contracts and prevent costly mistakes from bad terms
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          Ready to Take Control of Your Contracts?
        </h2>
        <p className={styles.ctaSubtitle}>
          Join hundreds of businesses saving time and money with AI-powered contract analysis
        </p>
        <Link href="/dashboard/contracts/upload" className={styles.primaryButton}>
          Start Your Free Analysis
          <ArrowRight size={20} />
        </Link>
      </section>

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
            </div>

            {/* Product */}
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>Product</h3>
              <div className={styles.footerLinks}>
                <Link href="/#features" className={styles.footerLink}>Features</Link>
                <Link href="/how-it-works" className={styles.footerLink}>How it Works</Link>
                <Link href="/pricing" className={styles.footerLink}>Pricing</Link>
              </div>
            </div>

            {/* Support */}
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>Support</h3>
              <div className={styles.footerLinks}>
                <Link href="/contact" className={styles.footerLink}>Contact Support</Link>
                <a href="mailto:support@legalreviewiq.com" className={styles.footerLink}>Email Us</a>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div className={styles.footerCopyright}>
              © 2024 Legal Review IQ. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <LandingPageContent />
    </div>
  )
}
