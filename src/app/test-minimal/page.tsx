// src/app/test-minimal/page.tsx
// A minimal page that won't crash even if Supabase isn't configured

export default function TestMinimalPage() {
  // This runs on the server, so we can safely check env vars
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  
  const allConfigured = hasUrl && hasAnonKey && hasServiceKey
  
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>Contract Analyzer - Configuration Test</h1>
      
      <div style={{
        background: allConfigured ? '#d4edda' : '#f8d7da',
        border: `1px solid ${allConfigured ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h2 style={{ color: allConfigured ? '#155724' : '#721c24' }}>
          {allConfigured ? '✅ Configuration Complete' : '❌ Configuration Incomplete'}
        </h2>
        
        <ul style={{ marginTop: '10px' }}>
          <li>
            NEXT_PUBLIC_SUPABASE_URL: {hasUrl ? '✅ Set' : '❌ Missing'}
          </li>
          <li>
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {hasAnonKey ? '✅ Set' : '❌ Missing'}
          </li>
          <li>
            SUPABASE_SERVICE_ROLE_KEY: {hasServiceKey ? '✅ Set' : '❌ Missing'}
          </li>
        </ul>
      </div>
      
      {!allConfigured && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#856404' }}>⚠️ Action Required</h3>
          <ol>
            <li>Go to your Vercel Dashboard</li>
            <li>Navigate to Settings → Environment Variables</li>
            <li>Add the missing variables shown above</li>
            <li>Make sure to select ALL environments (Production, Preview, Development)</li>
            <li>Redeploy your application</li>
          </ol>
          
          <p style={{ marginTop: '15px' }}>
            <strong>Important:</strong> Don't include quotes around the values!
          </p>
        </div>
      )}
      
      <div style={{
        background: '#e9ecef',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h3>Get Your Supabase Credentials</h3>
        <ol>
          <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">supabase.com/dashboard</a></li>
          <li>Select your project</li>
          <li>Go to Settings → API</li>
          <li>Copy the values:
            <ul>
              <li><strong>Project URL</strong> → NEXT_PUBLIC_SUPABASE_URL</li>
              <li><strong>anon public</strong> → NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li><strong>service_role</strong> → SUPABASE_SERVICE_ROLE_KEY</li>
            </ul>
          </li>
        </ol>
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <a 
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: allConfigured ? '#007bff' : '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            pointerEvents: allConfigured ? 'auto' : 'none',
            opacity: allConfigured ? 1 : 0.6
          }}
        >
          {allConfigured ? 'Go to Contract Analyzer →' : 'Fix Configuration First'}
        </a>
      </div>
    </div>
  )
}