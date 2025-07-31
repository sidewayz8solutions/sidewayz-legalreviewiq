// src/app/debug/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [config, setConfig] = useState<any>({})
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Check client-side environment variables
    const clientConfig = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    }
    
    setConfig(clientConfig)

    // Check if we can access the API
    fetch('/api/test-env')
      .then(res => res.json())
      .then(data => {
        setConfig(prev => ({ ...prev, serverConfig: data }))
      })
      .catch(err => {
        setError('Failed to fetch server config: ' + err.message)
      })
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Information</h1>
      
      <h2>Client-Side Config:</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
        {JSON.stringify(config, null, 2)}
      </pre>

      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      <h2>Quick Checks:</h2>
      <ul>
        <li>
          Supabase URL: {' '}
          {config.NEXT_PUBLIC_SUPABASE_URL && config.NEXT_PUBLIC_SUPABASE_URL !== 'NOT SET' 
            ? '✅ Set' 
            : '❌ Missing'}
        </li>
        <li>
          Supabase Anon Key: {' '}
          {config.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'SET (hidden)' 
            ? '✅ Set' 
            : '❌ Missing'}
        </li>
      </ul>

      <h2>Instructions:</h2>
      <ol>
        <li>If you see "NOT SET" above, your environment variables are not configured in Vercel</li>
        <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
        <li>Add the missing variables for ALL environments (Production, Preview, Development)</li>
        <li>Redeploy your application</li>
      </ol>
    </div>
  )
}