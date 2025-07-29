'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, ChevronDown, Settings, Users, LogOut } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import styles from './Navigation.module.css'

interface NavigationProps {
  className?: string
}

export default function Navigation({ className }: NavigationProps) {
  const router = useRouter()
  const { user, loading } = useUser()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    // Implement logout logic here
    setDropdownOpen(false)
    router.push('/')
  }

  const shouldShowPremiumDropdown = user?.isPremium && user?.isActiveSubscription

  return (
    <nav className={`${styles.nav} ${className || ''}`}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.logo}>
          <Sparkles size={24} />
          Legal Review IQ
        </Link>
        <div className={styles.navLinks}>
          <Link href="/#features" className={styles.navLink}>✨ Features</Link>
          <Link href="/how-it-works" className={styles.navLink}>🚀 How it Works</Link>
          <Link href="/pricing" className={styles.navLink}>💎 Pricing</Link>
          
          {loading ? (
            <div className={styles.loadingButton}>
              <div className={styles.spinner}></div>
              Updating...
            </div>
          ) : shouldShowPremiumDropdown ? (
            <div className={styles.dropdown} ref={dropdownRef}>
              <button
                className={styles.dropdownButton}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.email}
                <ChevronDown
                  size={16}
                  className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}
                />
              </button>
              
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link 
                    href="/settings" 
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <Link 
                    href="/profiles" 
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Users size={16} />
                    Profiles
                  </Link>
                  <button 
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/dashboard/contracts/upload" className={styles.ctaButton}>
              Try Free →
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
