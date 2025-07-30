// Test environment variables
console.log('Environment Variables Check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'MISSING');

// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  console.log('\nTesting Supabase connection...');
  supabase.from('contracts').select('count').limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.log('Supabase Error:', error.message);
      } else {
        console.log('Supabase connection successful');
      }
    })
    .catch(err => {
      console.log('Supabase connection failed:', err.message);
    });
} else {
  console.log('Supabase environment variables not set');
}
