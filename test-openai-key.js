const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

async function testOpenAIKey() {
  console.log('Testing OpenAI API Key...\n');
  
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('API Key found:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND');
  
  if (!apiKey) {
    console.log('❌ No OpenAI API key found in environment variables');
    return;
  }
  
  const openai = new OpenAI({
    apiKey: apiKey
  });
  
  try {
    console.log('Making test API call...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "Hello, API key is working!"' }],
      max_tokens: 20
    });
    
    console.log('✅ OpenAI API key is working!');
    console.log('Response:', completion.choices[0].message.content);
    
  } catch (error) {
    console.log('❌ OpenAI API key test failed:');
    console.log('Error:', error.message);
    
    if (error.status === 401) {
      console.log('💡 This means the API key is invalid or expired');
    } else if (error.status === 429) {
      console.log('💡 Rate limit exceeded - but the key is valid');
    } else if (error.status === 402) {
      console.log('💡 Billing issue - check your OpenAI account billing');
    }
  }
}

testOpenAIKey();
