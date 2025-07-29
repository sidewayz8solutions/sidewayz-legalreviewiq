'use client'

import { UserProvider } from '@/contexts/UserContext'
import { Toaster } from 'react-hot-toast'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }}
      />
    </UserProvider>
  )
}
