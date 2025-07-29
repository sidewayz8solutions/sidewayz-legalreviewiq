'use client'

import Link from 'next/link'
import { ArrowRight, Upload, CheckCircle, FileSearch, Shield, Clock, DollarSign } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { useUser } from '@/contexts/UserContext'
import styles from './how-it-works.module.css'

export default function HowItWorksPage() {
  const { user } = useUser()
  return (
    <div className={styles.container}>
      <Navigation />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            How Legal Review IQ Works
          </h1>
          <p className={styles.heroSubtitle}>
            Three simple steps to understand any contract and protect your business from hidden risks
          </p>
          <div className={styles.heroButtons}>
            <Link href="/demo" className={styles.demoButton}>
              See Sample Analysis
              <ArrowRight size={20} />
            </Link>
            {!user?.isPremium && (
              <Link href="/dashboard/contracts/upload" className={styles.ctaButton}>
                Try Free
                <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className={styles.stepsSection}>
        <div className={styles.stepsGrid}>
          {/* Step 1 */}
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepIcon}>
              <Upload size={40} />
            </div>
            <h3 className={styles.stepTitle}>Upload Your Contract</h3>
            <p className={styles.stepDescription}>
              Simply drag and drop your PDF or Word document. Our platform supports all major contract formats and ensures your data is encrypted and secure.
            </p>
            <div className={styles.stepFeatures}>
              <div className={styles.feature}>
                <Shield size={16} />
                <span>Bank-level encryption</span>
              </div>
              <div className={styles.feature}>
                <FileSearch size={16} />
                <span>PDF & Word support</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepIcon}>
              <Sparkles size={40} />
            </div>
            <h3 className={styles.stepTitle}>AI Analyzes Every Clause</h3>
            <p className={styles.stepDescription}>
              Our advanced AI reads through every word, comparing against thousands of contracts to identify potential risks, unfavorable terms, and missing protections.
            </p>
            <div className={styles.stepFeatures}>
              <div className={styles.feature}>
                <Clock size={16} />
                <span>Under 30 seconds</span>
              </div>
              <div className={styles.feature}>
                <Sparkles size={16} />
                <span>99% accuracy rate</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepIcon}>
              <CheckCircle size={40} />
            </div>
            <h3 className={styles.stepTitle}>Get Clear Recommendations</h3>
            <p className={styles.stepDescription}>
              Receive a detailed report with risk scores, plain-English explanations, and specific action items to protect yourself before signing.
            </p>
            <div className={styles.stepFeatures}>
              <div className={styles.feature}>
                <CheckCircle size={16} />
                <span>Actionable insights</span>
              </div>
              <div className={styles.feature}>
                <DollarSign size={16} />
                <span>Save thousands</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <h2 className={styles.sectionTitle}>Why Choose Legal Review IQ?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <Clock size={32} />
            </div>
            <h3 className={styles.benefitTitle}>Lightning Fast</h3>
            <p className={styles.benefitDescription}>
              Get comprehensive contract analysis in under 30 seconds, not days
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <DollarSign size={32} />
            </div>
            <h3 className={styles.benefitTitle}>Save Money</h3>
            <p className={styles.benefitDescription}>
              Avoid expensive legal fees and costly contract mistakes
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <Shield size={32} />
            </div>
            <h3 className={styles.benefitTitle}>Stay Protected</h3>
            <p className={styles.benefitDescription}>
              Identify risks and red flags before they become problems
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          Ready to Analyze Your First Contract?
        </h2>
        <p className={styles.ctaSubtitle}>
          Join thousands of businesses protecting themselves with AI-powered contract analysis
        </p>
        <Link href="/dashboard/contracts/upload" className={styles.ctaButtonLarge}>
          Start Free Analysis
          <ArrowRight size={24} />
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.logo}>
            <Sparkles size={24} />
            Legal Review IQ
          </div>
          <p className={styles.footerText}>
            AI-powered contract analysis for modern businesses
          </p>
          <div className={styles.footerCopyright}>
            © 2024 Legal Review IQ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
