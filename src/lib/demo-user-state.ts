// Simple in-memory storage for demo purposes
// In production, this would be in a database

interface DemoUserStatus {
  isPremium: boolean
  isActiveSubscription: boolean
  email: string
  subscriptionStatus: string | null
  planType: string | null
  trialEnd: string | null
  currentPeriodEnd: string | null
}

let demoUserStatus: DemoUserStatus = {
  isPremium: false,
  isActiveSubscription: false,
  email: 'demo@example.com',
  subscriptionStatus: null,
  planType: null,
  trialEnd: null,
  currentPeriodEnd: null
}

export function getDemoUserStatus(): DemoUserStatus {
  return { ...demoUserStatus }
}

export function updateDemoUserStatus(updates: Partial<DemoUserStatus>): void {
  demoUserStatus = { ...demoUserStatus, ...updates }
  console.log('Demo user status updated:', demoUserStatus)
}

export function resetDemoUserStatus(): void {
  demoUserStatus = {
    isPremium: false,
    isActiveSubscription: false,
    email: 'demo@example.com',
    subscriptionStatus: null,
    planType: null,
    trialEnd: null,
    currentPeriodEnd: null
  }
  console.log('Demo user status reset')
}
