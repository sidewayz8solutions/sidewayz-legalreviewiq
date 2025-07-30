const fs = require('fs');

async function testMockAnalysis() {
  console.log('Testing Contract Analysis with Mock OpenAI...\n');

  // Read the test contract content
  const contractContent = fs.readFileSync('test-contract.txt', 'utf8');

  try {
    const response = await fetch('http://localhost:3000/api/test-analyze-mock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contractText: contractContent,
        userId: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: '550e8400-e29b-41d4-a716-446655440001'
      })
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ MOCK ANALYSIS SUCCESSFUL!');
      console.log('Contract ID:', result.contractId);
      console.log('Risk Level:', result.analysis?.riskLevel);
      console.log('Risk Score:', result.analysis?.riskScore);
      console.log('\n📋 Analysis Summary:');
      console.log('Summary:', result.analysis?.summary);
      console.log('\n🔑 Key Terms:');
      result.analysis?.keyTerms?.forEach((term, i) => console.log(`${i + 1}. ${term}`));
      console.log('\n🚩 Red Flags:');
      result.analysis?.redFlags?.forEach((flag, i) => console.log(`${i + 1}. ${flag}`));
      console.log('\n✅ Favorable Terms:');
      result.analysis?.favorableTerms?.forEach((term, i) => console.log(`${i + 1}. ${term}`));
      console.log('\n💡 Recommendations:');
      result.analysis?.recommendations?.forEach((rec, i) => console.log(`${i + 1}. ${rec}`));
    } else {
      console.log('\n❌ Mock analysis failed');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run the test
testMockAnalysis().catch(console.error);
