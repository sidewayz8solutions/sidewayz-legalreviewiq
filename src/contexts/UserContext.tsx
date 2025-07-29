'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  email: string
  isPremium: boolean
  isActiveSubscription: boolean
  subscriptionStatus: 'active' | 'trialing' | 'canceled' | null
  planType: string | null
  trialEnd: string | null
  currentPeriodEnd: string | null
}

interface UserContextType {
  user: User | null
  loading: boolean
  setPremiumUser: () => void
  setFreeUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize with default free user or load from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('demo-user-state')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
      }
    } else {
      const defaultUser: User = {
        email: 'demo@example.com',
        isPremium: false,
        isActiveSubscription: false,
        subscriptionStatus: null,
        planType: null,
        trialEnd: null,
        currentPeriodEnd: null
      }
      setUser(defaultUser)
    }
    setLoading(false)
  }, [])

  const setPremiumUser = () => {
    const premiumUser: User = {
      email: 'premium-user@example.com',
      isPremium: true,
      isActiveSubscription: true,
      subscriptionStatus: 'active',
      planType: 'professional',
      trialEnd: null,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
    setUser(premiumUser)
    localStorage.setItem('demo-user-state', JSON.stringify(premiumUser))
  }

  const setFreeUser = () => {
    const freeUser: User = {
      email: 'demo@example.com',
      isPremium: false,
      isActiveSubscription: false,
      subscriptionStatus: null,
      planType: null,
      trialEnd: null,
      currentPeriodEnd: null
    }
    setUser(freeUser)
    localStorage.setItem('demo-user-state', JSON.stringify(freeUser))
  }

  // Make reset function available globally for testing
  useEffect(() => {
    (window as any).resetToFreeUser = setFreeUser
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, setPremiumUser, setFreeUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
