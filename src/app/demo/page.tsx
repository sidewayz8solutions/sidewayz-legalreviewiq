'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles, AlertTriangle, CheckCircle, XCircle, Info, FileText, Shield, Clock } from 'lucide-react'
import styles from './demo.module.css'

export default function DemoPage() {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <Sparkles size={24} />
            Law Review IQ
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
          <h1 className={styles.title}>Sample Contract Analysis</h1>
          <p className={styles.subtitle}>
            See how Law Review IQ analyzes a typical service agreement
          </p>
        </div>

        <div className={styles.analysisContainer}>
          {/* Contract Info */}
          <div className={styles.contractInfo}>
            <h2 className={styles.contractTitle}>Software Development Service Agreement</h2>
            <div className={styles.contractMeta}>
              <div className={styles.metaItem}>
                <Clock size={16} />
                <span>Analyzed in 23 seconds</span>
              </div>
              <div className={styles.metaItem}>
                <FileText size={16} />
                <span>12 pages • 3,247 words</span>
              </div>
            </div>
          </div>

          {/* Risk Score */}
          <div className={styles.riskScore}>
            <div className={styles.scoreHeader}>
              <h3 className={styles.scoreTitle}>Overall Risk Score</h3>
              <div className={styles.scoreValue}>
                <span className={styles.scoreNumber}>7.2</span>
                <span className={styles.scoreMax}>/10</span>
              </div>
            </div>
            <div className={styles.scoreBar}>
              <div className={styles.scoreProgress} style={{width: '72%'}}></div>
            </div>
            <p className={styles.scoreDescription}>
              <strong>High Risk:</strong> This contract contains several unfavorable terms that could expose you to significant liability.
            </p>
          </div>

          {/* Key Issues */}
          <div className={styles.issuesSection}>
            <h3 className={styles.sectionTitle}>🚨 Critical Issues Found</h3>
            <div className={styles.issuesList}>
              <div className={styles.issue}>
                <div className={styles.issueIcon}>
                  <XCircle className={styles.criticalIcon} size={24} />
                </div>
                <div className={styles.issueContent}>
                  <h4 className={styles.issueTitle}>Unlimited Liability Clause</h4>
                  <p className={styles.issueDescription}>
                    Section 8.2 makes you liable for "any and all damages" without cap. This could expose you to unlimited financial risk.
                  </p>
                  <div className={styles.issueQuote}>
                    "Client shall be liable for any and all damages, losses, or expenses arising from or related to this agreement..."
                  </div>
                  <div className={styles.issueRecommendation}>
                    <strong>Recommendation:</strong> Negotiate a liability cap equal to the contract value or 12 months of fees.
                  </div>
                </div>
              </div>

              <div className={styles.issue}>
                <div className={styles.issueIcon}>
                  <AlertTriangle className={styles.warningIcon} size={24} />
                </div>
                <div className={styles.issueContent}>
                  <h4 className={styles.issueTitle}>Automatic Renewal Terms</h4>
                  <p className={styles.issueDescription}>
                    Contract automatically renews for 2-year terms unless cancelled 90 days in advance. This is unusually restrictive.
                  </p>
                  <div className={styles.issueQuote}>
                    "This agreement shall automatically renew for successive two (2) year periods unless either party provides ninety (90) days written notice..."
                  </div>
                  <div className={styles.issueRecommendation}>
                    <strong>Recommendation:</strong> Reduce to 1-year renewals with 30-day notice period.
                  </div>
                </div>
              </div>

              <div className={styles.issue}>
                <div className={styles.issueIcon}>
                  <AlertTriangle className={styles.warningIcon} size={24} />
                </div>
                <div className={styles.issueContent}>
                  <h4 className={styles.issueTitle}>Broad IP Assignment</h4>
                  <p className={styles.issueDescription}>
                    You're required to assign all intellectual property rights, including pre-existing IP and improvements.
                  </p>
                  <div className={styles.issueQuote}>
                    "All intellectual property created, developed, or improved during the term shall be exclusively owned by Company..."
                  </div>
                  <div className={styles.issueRecommendation}>
                    <strong>Recommendation:</strong> Limit to work product specifically created for this project only.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Positive Aspects */}
          <div className={styles.positiveSection}>
            <h3 className={styles.sectionTitle}>✅ Positive Aspects</h3>
            <div className={styles.positiveList}>
              <div className={styles.positiveItem}>
                <CheckCircle className={styles.positiveIcon} size={20} />
                <span>Clear payment terms with 30-day payment schedule</span>
              </div>
              <div className={styles.positiveItem}>
                <CheckCircle className={styles.positiveIcon} size={20} />
                <span>Well-defined scope of work and deliverables</span>
              </div>
              <div className={styles.positiveItem}>
                <CheckCircle className={styles.positiveIcon} size={20} />
                <span>Reasonable confidentiality provisions</span>
              </div>
              <div className={styles.positiveItem}>
                <CheckCircle className={styles.positiveIcon} size={20} />
                <span>Standard force majeure clause included</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>📋 Executive Summary</h3>
            <p className={styles.summaryText}>
              This software development agreement contains several high-risk provisions that heavily favor the service provider. 
              The unlimited liability clause poses the greatest concern, potentially exposing you to financial damages far exceeding 
              the contract value. The automatic renewal terms and broad IP assignment also require careful consideration and negotiation.
            </p>
            <p className={styles.summaryText}>
              <strong>Our recommendation:</strong> Do not sign this contract without significant modifications. Focus on negotiating 
              liability caps, reducing renewal terms, and limiting IP assignment scope.
            </p>
          </div>

          {/* CTA */}
          <div className={styles.cta}>
            <h3 className={styles.ctaTitle}>Ready to Analyze Your Contract?</h3>
            <p className={styles.ctaDescription}>
              Get the same detailed analysis for your contracts in under 30 seconds
            </p>
            <Link href="/dashboard/contracts/upload" className={styles.ctaButton}>
              Analyze Your Contract Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
