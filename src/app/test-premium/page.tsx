'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import Navigation from '@/components/Navigation'
import styles from './test-premium.module.css'

function TestPremiumContent() {
  const { user, setPremiumUser, setFreeUser } = useUser()
  const [loading, setLoading] = useState(false)

  const togglePremiumStatus = async (isPremium: boolean) => {
    setLoading(true)
    try {
      if (isPremium) {
        setPremiumUser()
      } else {
        setFreeUser()
      }
    } catch (error) {
      console.error('Error updating premium status:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      
      <div className={styles.content}>
        {/* Back Button */}
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className={styles.container}>
          <h1 className={styles.title}>Test Premium Navigation</h1>
          <p className={styles.subtitle}>
            Use this page to test the premium navigation dropdown functionality
          </p>

          <div className={styles.statusCard}>
            <h2>Current User Status</h2>
            <div className={styles.statusInfo}>
              <p><strong>Email:</strong> {user?.email || 'Loading...'}</p>
              <p><strong>Premium:</strong> {user?.isPremium ? 'Yes' : 'No'}</p>
              <p><strong>Active Subscription:</strong> {user?.isActiveSubscription ? 'Yes' : 'No'}</p>
              <p><strong>Plan Type:</strong> {user?.planType || 'None'}</p>
              <p><strong>Subscription Status:</strong> {user?.subscriptionStatus || 'None'}</p>
            </div>
          </div>

          <div className={styles.actions}>
            <h2>Test Actions</h2>
            <p>Click these buttons to simulate different user states and see how the navigation changes:</p>
            
            <div className={styles.buttonGroup}>
              <button
                onClick={() => togglePremiumStatus(true)}
                disabled={loading}
                className={`${styles.button} ${styles.premiumButton}`}
              >
                {loading ? 'Loading...' : 'Set as Premium User'}
              </button>
              
              <button
                onClick={() => togglePremiumStatus(false)}
                disabled={loading}
                className={`${styles.button} ${styles.freeButton}`}
              >
                {loading ? 'Loading...' : 'Set as Free User'}
              </button>
            </div>
          </div>

          <div className={styles.instructions}>
            <h2>How to Test</h2>
            <ol>
              <li>Click "Set as Premium User" to simulate a user with an active subscription</li>
              <li>Notice how the navigation changes from "Try Free →" to an email dropdown</li>
              <li>Click on the email dropdown to see the premium menu options:
                <ul>
                  <li>Settings - routes to /settings</li>
                  <li>Profiles - routes to /profiles</li>
                  <li>Log Out - handles logout</li>
                </ul>
              </li>
              <li>Click "Set as Free User" to return to the normal "Try Free →" button</li>
            </ol>
          </div>

          <div className={styles.note}>
            <p><strong>Note:</strong> This is a demo page for testing purposes. In production, the premium status would be determined by actual Stripe subscription data.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function TestPremiumPage() {
  return (
    <div className={styles.pageContainer}>
      <TestPremiumContent />
    </div>
  )
}
