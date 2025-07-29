'use client'

import Link from 'next/link'
import { ArrowRight, Shield, DollarSign, FileSearch, Sparkles } from 'lucide-react'
import styles from './landing.module.css'

// Real social proof - update with actual numbers as you grow
const SOCIAL_PROOF = {
  contractsAnalyzed: 127,
  moneySaved: 45000,
  timesSaved: 380
}

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <Sparkles size={30} />
            Legal Review IQ
          </div>
          <div className={styles.navLinks}>
            <Link href="#features" className={styles.navLink}>✨ Features</Link>
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
