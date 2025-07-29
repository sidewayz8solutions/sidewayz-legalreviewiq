'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Shield, Plus, Search, MoreVertical, Crown, User, Eye } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { useUser } from '@/contexts/UserContext'
import styles from './team-permissions.module.css'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  lastActive: string
  avatar?: string
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@acmecorp.com',
    role: 'admin',
    status: 'active',
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@acmecorp.com',
    role: 'editor',
    status: 'active',
    lastActive: '1 day ago'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@acmecorp.com',
    role: 'viewer',
    status: 'pending',
    lastActive: 'Never'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@acmecorp.com',
    role: 'editor',
    status: 'active',
    lastActive: '3 hours ago'
  }
]

export default function TeamPermissionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const { user } = useUser()

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown size={16} />
      case 'editor': return <User size={16} />
      case 'viewer': return <Eye size={16} />
      default: return <User size={16} />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#f59e0b'
      case 'editor': return '#3b82f6'
      case 'viewer': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'pending': return '#f59e0b'
      case 'inactive': return '#ef4444'
      default: return '#6b7280'
    }
  }

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
            <Users size={32} />
          </div>
          <div>
            <h1 className={styles.title}>Team Permissions</h1>
            <p className={styles.subtitle}>Set up role-based access control for your team members</p>
          </div>
          <button 
            className={styles.inviteButton}
            onClick={() => setShowInviteModal(true)}
          >
            <Plus size={20} />
            Invite Member
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.roleFilter}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* Team Members Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className={styles.memberInfo}>
                      <div className={styles.avatar}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className={styles.memberName}>{member.name}</div>
                        <div className={styles.memberEmail}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.roleTag} style={{ color: getRoleColor(member.role) }}>
                      {getRoleIcon(member.role)}
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </div>
                  </td>
                  <td>
                    <span 
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(member.status) }}
                    >
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className={styles.lastActive}>{member.lastActive}</td>
                  <td>
                    <button className={styles.actionButton}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Role Permissions Info */}
        <div className={styles.permissionsInfo}>
          <h3>Role Permissions</h3>
          <div className={styles.roleCards}>
            <div className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <Crown size={20} style={{ color: '#f59e0b' }} />
                <h4>Admin</h4>
              </div>
              <ul>
                <li>Full access to all features</li>
                <li>Manage team members and permissions</li>
                <li>Access billing and organization settings</li>
                <li>Delete contracts and data</li>
              </ul>
            </div>
            <div className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <User size={20} style={{ color: '#3b82f6' }} />
                <h4>Editor</h4>
              </div>
              <ul>
                <li>Upload and analyze contracts</li>
                <li>Edit contract annotations</li>
                <li>Create and manage profiles</li>
                <li>View team analytics</li>
              </ul>
            </div>
            <div className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <Eye size={20} style={{ color: '#6b7280' }} />
                <h4>Viewer</h4>
              </div>
              <ul>
                <li>View contracts and analysis results</li>
                <li>Download reports</li>
                <li>Access basic analytics</li>
                <li>Cannot edit or delete content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowInviteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Invite Team Member</h3>
            <div className={styles.inviteForm}>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input type="email" placeholder="Enter email address" />
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <select>
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Personal Message (Optional)</label>
                <textarea placeholder="Add a personal message to the invitation..."></textarea>
              </div>
              <div className={styles.modalActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button className={styles.sendButton}>
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
