'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Building, Users } from 'lucide-react'
import Navigation from '@/components/Navigation'
import styles from './profiles.module.css'

interface Profile {
  id: string
  name: string
  type: 'organization' | 'team'
  members: number
  contractsAnalyzed: number
  createdAt: string
}

export default function ProfilesPage() {
  const [profiles] = useState<Profile[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      type: 'organization',
      members: 12,
      contractsAnalyzed: 45,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Legal Team',
      type: 'team',
      members: 3,
      contractsAnalyzed: 23,
      createdAt: '2024-02-01'
    }
  ])

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
          <div>
            <h1 className={styles.title}>Profiles</h1>
            <p className={styles.subtitle}>Manage your organizations and teams</p>
          </div>
          <button className={styles.createButton}>
            <Plus size={20} />
            Create Profile
          </button>
        </div>

        <div className={styles.profilesGrid}>
          {profiles.map((profile) => (
            <div key={profile.id} className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.profileIcon}>
                  {profile.type === 'organization' ? (
                    <Building size={24} />
                  ) : (
                    <Users size={24} />
                  )}
                </div>
                <div className={styles.profileActions}>
                  <button className={styles.actionButton}>
                    <Edit size={16} />
                  </button>
                  <button className={styles.actionButton}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.profileInfo}>
                <h3 className={styles.profileName}>{profile.name}</h3>
                <p className={styles.profileType}>
                  {profile.type === 'organization' ? 'Organization' : 'Team'}
                </p>
              </div>

              <div className={styles.profileStats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{profile.members}</span>
                  <span className={styles.statLabel}>Members</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{profile.contractsAnalyzed}</span>
                  <span className={styles.statLabel}>Contracts</span>
                </div>
              </div>

              <div className={styles.profileFooter}>
                <span className={styles.createdDate}>
                  Created {new Date(profile.createdAt).toLocaleDateString()}
                </span>
                <button className={styles.selectButton}>Select</button>
              </div>
            </div>
          ))}

          {/* Empty state for creating new profile */}
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>
              <Plus size={32} />
            </div>
            <h3 className={styles.emptyTitle}>Create New Profile</h3>
            <p className={styles.emptyDescription}>
              Set up a new organization or team profile to manage contracts and members
            </p>
            <button className={styles.emptyButton}>
              Get Started
            </button>
          </div>
        </div>

        {/* Profile Management Section */}
        <div className={styles.managementSection}>
          <h2 className={styles.sectionTitle}>Profile Management</h2>
          <div className={styles.managementGrid}>
            <div className={styles.managementCard}>
              <h3>Organization Settings</h3>
              <p>Configure organization-wide settings, billing, and permissions</p>
              <button className={styles.managementButton}>Manage</button>
            </div>
            <div className={styles.managementCard}>
              <h3>Team Permissions</h3>
              <p>Set up role-based access control for your team members</p>
              <button className={styles.managementButton}>Configure</button>
            </div>
            <div className={styles.managementCard}>
              <h3>Usage Analytics</h3>
              <p>View detailed analytics and usage reports for all profiles</p>
              <button className={styles.managementButton}>View Reports</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
