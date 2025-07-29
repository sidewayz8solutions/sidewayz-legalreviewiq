'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles, Shield, FileText, AlertCircle } from 'lucide-react'
import styles from './terms.module.css'

export default function TermsOfServicePage() {
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
            <Link href="/#features" className={styles.navLink}>Features</Link>
            <Link href="/how-it-works" className={styles.navLink}>How it Works</Link>
            <Link href="/pricing" className={styles.navLink}>Pricing</Link>
            <Link href="/dashboard/contracts/upload" className={styles.ctaButton}>
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <Link href="/" className={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Home
      </Link>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <FileText size={48} />
          </div>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.subtitle}>
            Last updated: December 2024
          </p>
        </div>

        <div className={styles.document}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Agreement to Terms</h2>
            <p className={styles.paragraph}>
              By accessing and using Legal Review IQ ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Description of Service</h2>
            <p className={styles.paragraph}>
              Legal Review IQ provides AI-powered contract analysis services that help users understand contract terms, identify potential risks, and receive plain-English explanations of legal documents. Our service is designed to assist with contract review but does not replace professional legal advice.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. User Responsibilities</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>You must provide accurate information when using our service</li>
              <li className={styles.listItem}>You are responsible for maintaining the confidentiality of your account</li>
              <li className={styles.listItem}>You agree not to use the service for any unlawful purposes</li>
              <li className={styles.listItem}>You understand that our AI analysis is for informational purposes only</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Privacy and Data Security</h2>
            <p className={styles.paragraph}>
              We take your privacy seriously. All uploaded contracts are encrypted in transit and at rest. We automatically delete documents 30 days after analysis unless you choose to delete them sooner. For detailed information about how we handle your data, please review our Privacy Policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Limitation of Liability</h2>
            <div className={styles.warningBox}>
              <AlertCircle className={styles.warningIcon} size={24} />
              <div>
                <h3 className={styles.warningTitle}>Important Legal Notice</h3>
                <p className={styles.warningText}>
                  Legal Review IQ provides AI-powered analysis for informational purposes only. Our service does not constitute legal advice and should not be relied upon as a substitute for consultation with qualified legal professionals. We are not liable for any decisions made based on our analysis.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Payment Terms</h2>
            <p className={styles.paragraph}>
              Payment for our services is processed securely through Stripe. Subscription fees are billed monthly or annually as selected. You may cancel your subscription at any time, and you will continue to have access until the end of your billing period.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Intellectual Property</h2>
            <p className={styles.paragraph}>
              The Legal Review IQ platform, including all software, algorithms, and content, is protected by intellectual property laws. You retain ownership of the contracts you upload, and we do not claim any rights to your documents.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Termination</h2>
            <p className={styles.paragraph}>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Changes to Terms</h2>
            <p className={styles.paragraph}>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Contact Information</h2>
            <p className={styles.paragraph}>
              If you have any questions about these Terms of Service, please contact us at legal@legalreviewiq.com.
            </p>
          </section>
        </div>
      </div>

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
          <div className={styles.footerLinks}>
            <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
          </div>
          <div className={styles.footerCopyright}>
            © 2024 Legal Review IQ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
