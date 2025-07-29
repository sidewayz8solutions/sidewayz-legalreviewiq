'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles, Shield, Lock, Eye, Database } from 'lucide-react'
import styles from './privacy.module.css'

export default function PrivacyPolicyPage() {
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
            <Shield size={48} />
          </div>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            Last updated: December 2024
          </p>
        </div>

        <div className={styles.document}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Commitment to Privacy</h2>
            <p className={styles.paragraph}>
              At Legal Review IQ, we understand that your contracts contain sensitive and confidential information. This Privacy Policy explains how we collect, use, protect, and handle your personal information and documents when you use our AI-powered contract analysis service.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Information We Collect</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Eye size={24} />
                </div>
                <h3 className={styles.infoTitle}>Personal Information</h3>
                <p className={styles.infoText}>
                  Email address, name, and billing information when you create an account or make a purchase.
                </p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Database size={24} />
                </div>
                <h3 className={styles.infoTitle}>Usage Data</h3>
                <p className={styles.infoText}>
                  Information about how you use our service, including analysis history and feature usage.
                </p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Lock size={24} />
                </div>
                <h3 className={styles.infoTitle}>Contract Documents</h3>
                <p className={styles.infoText}>
                  The contracts you upload for analysis, which are encrypted and automatically deleted after 30 days.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>Provide AI-powered contract analysis services</li>
              <li className={styles.listItem}>Process payments and manage your account</li>
              <li className={styles.listItem}>Improve our AI algorithms and service quality</li>
              <li className={styles.listItem}>Send important service updates and notifications</li>
              <li className={styles.listItem}>Provide customer support when requested</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Data Security & Protection</h2>
            <div className={styles.securityGrid}>
              <div className={styles.securityFeature}>
                <Shield className={styles.securityIcon} size={32} />
                <h3 className={styles.securityTitle}>End-to-End Encryption</h3>
                <p className={styles.securityText}>All documents are encrypted in transit and at rest using industry-standard AES-256 encryption.</p>
              </div>
              <div className={styles.securityFeature}>
                <Lock className={styles.securityIcon} size={32} />
                <h3 className={styles.securityTitle}>Automatic Deletion</h3>
                <p className={styles.securityText}>Uploaded contracts are automatically deleted from our servers 30 days after analysis.</p>
              </div>
              <div className={styles.securityFeature}>
                <Database className={styles.securityIcon} size={32} />
                <h3 className={styles.securityTitle}>Secure Infrastructure</h3>
                <p className={styles.securityText}>Our servers are hosted on secure, SOC 2 compliant infrastructure with regular security audits.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Information Sharing</h2>
            <p className={styles.paragraph}>
              We do not sell, trade, or otherwise transfer your personal information or contract documents to third parties. We may share information only in the following limited circumstances:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>With your explicit consent</li>
              <li className={styles.listItem}>To comply with legal obligations or court orders</li>
              <li className={styles.listItem}>To protect our rights, property, or safety</li>
              <li className={styles.listItem}>With trusted service providers who assist in operating our service (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Rights</h2>
            <p className={styles.paragraph}>
              You have the right to:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Access and review your personal information</li>
              <li className={styles.listItem}>Request correction of inaccurate information</li>
              <li className={styles.listItem}>Delete your account and associated data</li>
              <li className={styles.listItem}>Export your data in a portable format</li>
              <li className={styles.listItem}>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cookies and Tracking</h2>
            <p className={styles.paragraph}>
              We use essential cookies to provide our service and analytics cookies to understand how our service is used. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
            <p className={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through our service. Your continued use of Legal Review IQ after such modifications constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <p className={styles.paragraph}>
              If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@legalreviewiq.com or through our support system.
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
