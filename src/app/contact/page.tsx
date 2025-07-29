'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles, Mail, Phone, MessageCircle, Clock, MapPin, Send } from 'lucide-react'
import styles from './contact.module.css'

export default function ContactPage() {
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
            <MessageCircle size={48} />
          </div>
          <h1 className={styles.title}>Contact Support</h1>
          <p className={styles.subtitle}>
            Get help with Law Review IQ - we're here to assist you
          </p>
        </div>

        <div className={styles.contactContainer}>
          {/* Contact Methods */}
          <div className={styles.contactMethods}>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <Mail size={32} />
              </div>
              <h3 className={styles.contactTitle}>Email Support</h3>
              <p className={styles.contactDescription}>
                Send us an email and we'll respond within 24 hours
              </p>
              <a href="mailto:support@lawreviewiq.com" className={styles.contactLink}>
                support@lawreviewiq.com
              </a>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <Phone size={32} />
              </div>
              <h3 className={styles.contactTitle}>Phone Support</h3>
              <p className={styles.contactDescription}>
                Call us during business hours for immediate assistance
              </p>
              <a href="tel:+12253019908" className={styles.contactLink}>
                (225) 301-9908
              </a>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <Clock size={32} />
              </div>
              <h3 className={styles.contactTitle}>Business Hours</h3>
              <p className={styles.contactDescription}>
                We're available to help during these times
              </p>
              <div className={styles.hoursInfo}>
                <p>Monday - Friday: 9:00 AM - 6:00 PM CST</p>
                <p>Saturday: 10:00 AM - 4:00 PM CST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.contactForm}>
            <h2 className={styles.formTitle}>Send us a Message</h2>
            <p className={styles.formDescription}>
              Fill out the form below and we'll get back to you as soon as possible
            </p>
            
            <form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.label}>First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={styles.input}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={styles.input}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>Subject</label>
                <select id="subject" name="subject" className={styles.select} required>
                  <option value="">Select a topic</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className={styles.textarea}
                  placeholder="Describe your question or issue in detail..."
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How quickly do you respond to support requests?</h3>
                <p className={styles.faqAnswer}>
                  We typically respond to email inquiries within 24 hours during business days. Phone support is available for immediate assistance during business hours.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What information should I include in my support request?</h3>
                <p className={styles.faqAnswer}>
                  Please include your account email, a detailed description of the issue, and any error messages you're seeing. Screenshots are also helpful.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Do you offer phone support for all plans?</h3>
                <p className={styles.faqAnswer}>
                  Phone support is available for all paid plans. Free trial users can reach us via email, and we'll respond promptly.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can you help with contract analysis questions?</h3>
                <p className={styles.faqAnswer}>
                  Absolutely! Our support team can help you understand how to use Law Review IQ effectively and interpret the analysis results.
                </p>
              </div>
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
                Law Review IQ
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
                <Link href="/demo" className={styles.footerLink}>Sample Analysis</Link>
                <Link href="/pricing" className={styles.footerLink}>Pricing</Link>
              </div>
            </div>

            {/* Support */}
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>Support</h3>
              <div className={styles.footerLinks}>
                <Link href="/contact" className={styles.footerLink}>Contact Support</Link>
                <a href="mailto:support@lawreviewiq.com" className={styles.footerLink}>Email Us</a>
                <a href="tel:+12253019908" className={styles.footerLink}>Call Us</a>
              </div>
            </div>

            {/* Legal */}
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>Legal</h3>
              <div className={styles.footerLinks}>
                <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
                <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div className={styles.footerCopyright}>
              © 2024 Law Review IQ. All rights reserved.
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
