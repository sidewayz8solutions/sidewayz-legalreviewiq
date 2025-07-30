// Decode JWT token to see project details
const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bmFpaWNqY2VsdmR1bmx1d3FoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc2MDg2MSwiZXhwIjoyMDY5MzM2ODYxfQ.8Ugafib74_1btlN5acUz3rX2U4JyjHGWmSFsQthENMA'

// Decode the payload (middle part)
const payload = jwt.split('.')[1]
const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())

console.log('JWT Payload:', JSON.stringify(decoded, null, 2))
console.log('Project Reference:', decoded.ref)
console.log('Supabase URL should be:', `https://${decoded.ref}.supabase.co`)
