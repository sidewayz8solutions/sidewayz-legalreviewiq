'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Building2, Users, Settings, CreditCard, Globe, Shield, Bell } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { useUser } from '@/contexts/UserContext'
import styles from './organization.module.css'

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState('general')
  const { user } = useUser()

  return (
    <div className={styles.container}>
      <Navigation />

      {/* Back Button */}
      <Link href="/profiles" className={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Profiles
      </Link>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <Building2 size={32} />
          </div>
          <div>
            <h1 className={styles.title}>Organization Settings</h1>
            <p className={styles.subtitle}>Configure organization-wide settings, billing, and permissions</p>
          </div>
        </div>

        <div className={styles.settingsContainer}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <button
              className={`${styles.tabButton} ${activeTab === 'general' ? styles.active : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <Settings size={20} />
              General
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'billing' ? styles.active : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              <CreditCard size={20} />
              Billing
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'domains' ? styles.active : ''}`}
              onClick={() => setActiveTab('domains')}
            >
              <Globe size={20} />
              Domains
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'security' ? styles.active : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={20} />
              Security
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'notifications' ? styles.active : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={20} />
              Notifications
            </button>
          </div>

          {/* Content */}
          <div className={styles.tabContent}>
            {activeTab === 'general' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Organization Information</h2>
                <div className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Organization Name</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      defaultValue={user?.isPremium ? "Acme Corporation" : "Demo Organization"}
                      placeholder="Enter organization name" 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea 
                      className={styles.textarea} 
                      rows={3}
                      defaultValue="A leading technology company focused on innovation and excellence."
                      placeholder="Describe your organization" 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Industry</label>
                    <select className={styles.select}>
                      <option>Technology</option>
                      <option>Legal Services</option>
                      <option>Healthcare</option>
                      <option>Finance</option>
                      <option>Manufacturing</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Company Size</label>
                    <select className={styles.select}>
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201-1000 employees</option>
                      <option>1000+ employees</option>
                    </select>
                  </div>
                  <button className={styles.saveButton}>Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Billing Information</h2>
                <div className={styles.billingCard}>
                  <div className={styles.planInfo}>
                    <h3>Current Plan: {user?.isPremium ? 'Professional' : 'Free'}</h3>
                    <p className={styles.planDescription}>
                      {user?.isPremium 
                        ? 'Full access to all features with priority support'
                        : 'Limited access to basic features'
                      }
                    </p>
                  </div>
                  {user?.isPremium && (
                    <div className={styles.billingDetails}>
                      <div className={styles.billingRow}>
                        <span>Monthly Cost:</span>
                        <span>$149.00</span>
                      </div>
                      <div className={styles.billingRow}>
                        <span>Next Billing Date:</span>
                        <span>{user.currentPeriodEnd ? new Date(user.currentPeriodEnd).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className={styles.billingRow}>
                        <span>Payment Method:</span>
                        <span>•••• •••• •••• 4242</span>
                      </div>
                    </div>
                  )}
                  <div className={styles.billingActions}>
                    {user?.isPremium ? (
                      <>
                        <button className={styles.secondaryButton}>Update Payment Method</button>
                        <button className={styles.dangerButton}>Cancel Subscription</button>
                      </>
                    ) : (
                      <Link href="/pricing" className={styles.upgradeButton}>
                        Upgrade to Professional
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'domains' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Verified Domains</h2>
                <p className={styles.sectionDescription}>
                  Add and verify domains to automatically approve users with matching email addresses.
                </p>
                <div className={styles.domainsList}>
                  <div className={styles.domainItem}>
                    <div className={styles.domainInfo}>
                      <span className={styles.domainName}>acmecorp.com</span>
                      <span className={styles.domainStatus}>✅ Verified</span>
                    </div>
                    <button className={styles.removeButton}>Remove</button>
                  </div>
                </div>
                <div className={styles.addDomain}>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Enter domain (e.g., company.com)" 
                  />
                  <button className={styles.addButton}>Add Domain</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Security Settings</h2>
                <div className={styles.securityOptions}>
                  <div className={styles.securityOption}>
                    <div className={styles.optionInfo}>
                      <h4>Two-Factor Authentication</h4>
                      <p>Require 2FA for all organization members</p>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className={styles.securityOption}>
                    <div className={styles.optionInfo}>
                      <h4>Single Sign-On (SSO)</h4>
                      <p>Enable SAML/OAuth integration</p>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className={styles.securityOption}>
                    <div className={styles.optionInfo}>
                      <h4>IP Restrictions</h4>
                      <p>Limit access to specific IP addresses</p>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Organization Notifications</h2>
                <div className={styles.notificationOptions}>
                  <div className={styles.notificationOption}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} defaultChecked />
                      New member joins organization
                    </label>
                  </div>
                  <div className={styles.notificationOption}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} defaultChecked />
                      Billing and payment notifications
                    </label>
                  </div>
                  <div className={styles.notificationOption}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} />
                      Weekly usage reports
                    </label>
                  </div>
                  <div className={styles.notificationOption}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} />
                      Security alerts and warnings
                    </label>
                  </div>
                </div>
                <button className={styles.saveButton}>Save Notification Preferences</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
