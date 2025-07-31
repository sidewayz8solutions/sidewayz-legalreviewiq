// Test script for Hugging Face contract analysis
const fetch = require('node:fetch');

async function testHuggingFaceContract() {
  console.log('🤗 Testing Hugging Face Contract Analysis');
  console.log('=' .repeat(50));
  
  // You need to replace this with your actual Vercel deployment URL
  const VERCEL_URL = 'https://your-app-name.vercel.app'; // ⚠️ REPLACE THIS WITH YOUR ACTUAL URL
  
  console.log(`Testing URL: ${VERCEL_URL}`);
  console.log('Testing endpoint: /api/test-contract-simple');
  console.log('=' .repeat(50));
  
  try {
    console.log('\n🔄 Testing Hugging Face contract analysis...');
    
    const response = await fetch(`${VERCEL_URL}/api/test-contract-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.log(`❌ Test failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Hugging Face contract analysis SUCCESSFUL!');
      console.log('\n📊 Analysis Results:');
      console.log('Risk Level:', data.analysis.riskLevel);
      console.log('Summary:', data.analysis.summary);
      console.log('Key Terms:', data.analysis.keyTerms);
      console.log('Red Flags:', data.analysis.redFlags);
      console.log('Favorable Terms:', data.analysis.favorableTerms);
      console.log('Recommendations:', data.analysis.recommendations);
      console.log('Confidence Score:', data.analysis.confidence);
      
      console.log('\n🤖 Model Information:');
      console.log('Type:', data.modelInfo.type);
      console.log('Models Used:', data.modelInfo.models);
      
      console.log('\n🎉 SUCCESS: Hugging Face models are working correctly!');
      console.log('✅ No OpenAI API key required');
      console.log('✅ All processing done locally/on Vercel');
      console.log('✅ Contract analysis is fully functional');
      
    } else {
      console.log('❌ Test failed:', data.error);
      console.log('Details:', data.details);
      console.log('Step:', data.step);
      
      console.log('\n🔧 Troubleshooting:');
      if (data.step === 'model_initialization') {
        console.log('   - Models failed to initialize');
        console.log('   - Check Vercel function timeout settings');
        console.log('   - Verify @xenova/transformers package is installed');
      } else if (data.step === 'contract_analysis') {
        console.log('   - Analysis process failed');
        console.log('   - Check model compatibility');
        console.log('   - Verify input text format');
      }
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error.message);
    console.log('\n💡 This might mean:');
    console.log('   - Your Vercel app URL is incorrect');
    console.log('   - Your app is not deployed');
    console.log('   - Network connectivity issues');
    console.log('   - The API endpoint is not available');
  }
}

// Test local development server
async function testLocalDevelopment() {
  console.log('\n🏠 Testing Local Development Server');
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch('http://localhost:3000/api/test-contract-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Local development server is working');
      console.log('Analysis successful:', data.success);
    } else {
      console.log('❌ Local development server test failed');
    }
    
  } catch (error) {
    console.log('ℹ️  Local development server not running (this is normal if testing production)');
  }
}

// Instructions
console.log('📋 Hugging Face Contract Analysis Test');
console.log('=' .repeat(50));
console.log('This script tests the new Hugging Face-based contract analysis.');
console.log('');
console.log('⚠️  IMPORTANT: Update the VERCEL_URL variable above!');
console.log('');
console.log('📝 Steps:');
console.log('1. Deploy your updated code to Vercel');
console.log('2. Copy your Vercel deployment URL');
console.log('3. Replace VERCEL_URL in this script');
console.log('4. Run: node test-huggingface-contract.js');
console.log('');
console.log('🚀 Benefits of Hugging Face approach:');
console.log('✅ No API keys required');
console.log('✅ No external API costs');
console.log('✅ Better privacy (all processing on your servers)');
console.log('✅ Specialized legal text models');
console.log('✅ Consistent performance');
console.log('');

// Run tests
setTimeout(async () => {
  await testLocalDevelopment();
  await testHuggingFaceContract();
}, 2000);
