// src/components/AppWrapper.tsx
'use client'

import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const configured = isSupabaseConfigured()
      setIsConfigured(configured)
      
      if (!configured && process.env.NODE_ENV === 'production') {
        console.error('⚠️ Supabase is not configured properly')
        console.error('Missing environment variables. Check Vercel dashboard.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Configuration check failed')
    }
  }, [])

  // Show configuration error in development
  if (process.env.NODE_ENV === 'development' && isConfigured === false) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#fee',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: '#c00' }}>⚠️ Configuration Error</h1>
        <p>Supabase environment variables are not configured.</p>
        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px',
          maxWidth: '600px',
          margin: '20px auto',
          textAlign: 'left',
          border: '1px solid #fcc'
        }}>
          <h3>Required Environment Variables:</h3>
          <ul>
            <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
            <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
            <li><code>SUPABASE_SERVICE_ROLE_KEY</code></li>
          </ul>
          <p>Add these to your <code>.env.local</code> file for local development.</p>
        </div>
      </div>
    )
  }

  // Show error if configuration check failed
  if (error) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#fee',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: '#c00' }}>Application Error</h1>
        <p>{error}</p>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Please check the browser console for more details.
        </p>
      </div>
    )
  }

  // Render children normally
  return <>{children}</>
}

// Then wrap your app with this component in src/app/layout.tsx:
// 
// import AppWrapper from '@/components/AppWrapper'
// 
// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <body>
//         <AppWrapper>
//           {children}
//         </AppWrapper>
//       </body>
//     </html>
//   )
// }