'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Bell, CreditCard, Shield } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { useUser } from '@/contexts/UserContext'
import styles from './settings.module.css'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { user } = useUser()

  return (
    <div className={styles.container}>
      <Navigation />

      {/* Back Button */}
      <Link href="/" className={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Home
      </Link>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage your account preferences and subscription</p>
        </div>

        <div className={styles.settingsContainer}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <button
              className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              Profile
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'notifications' ? styles.active : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={20} />
              Notifications
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'billing' ? styles.active : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              <CreditCard size={20} />
              Billing
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'security' ? styles.active : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={20} />
              Security
            </button>
          </div>

          {/* Content */}
          <div className={styles.tabContent}>
            {activeTab === 'profile' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Profile Information</h2>
                <div className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      defaultValue={user?.isPremium ? "Premium User" : "Demo User"}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                      type="email"
                      className={styles.input}
                      defaultValue={user?.email || "demo@example.com"}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Company</label>
                    <input
                      type="text"
                      className={styles.input}
                      defaultValue={user?.isPremium ? "Premium Corp" : "Demo Company"}
                      placeholder="Enter your company name"
                    />
                  </div>
                  <button className={styles.saveButton}>Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Notification Preferences</h2>
                <div className={styles.form}>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} />
                      Email notifications for contract analysis completion
                    </label>
                  </div>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} />
                      Weekly usage reports
                    </label>
                  </div>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} />
                      Product updates and feature announcements
                    </label>
                  </div>
                  <button className={styles.saveButton}>Save Preferences</button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Billing & Subscription</h2>
                <div className={styles.billingInfo}>
                  <div className={styles.planCard}>
                    {user?.isPremium ? (
                      <>
                        <h3>Current Plan: {user.planType || 'Professional'}</h3>
                        <p>$149/month • Status: {user.subscriptionStatus}</p>
                        {user.currentPeriodEnd && (
                          <p>Next billing: {new Date(user.currentPeriodEnd).toLocaleDateString()}</p>
                        )}
                        <div className={styles.planActions}>
                          <button className={styles.secondaryButton}>Change Plan</button>
                          <button className={styles.dangerButton}>Cancel Subscription</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3>Current Plan: Free</h3>
                        <p>You're currently on the free plan</p>
                        <div className={styles.planActions}>
                          <Link href="/pricing" className={styles.saveButton}>
                            Upgrade to Premium
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Security Settings</h2>
                <div className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Current Password</label>
                    <input type="password" className={styles.input} placeholder="Enter current password" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>New Password</label>
                    <input type="password" className={styles.input} placeholder="Enter new password" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Confirm New Password</label>
                    <input type="password" className={styles.input} placeholder="Confirm new password" />
                  </div>
                  <button className={styles.saveButton}>Update Password</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
