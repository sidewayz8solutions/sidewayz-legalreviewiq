const fs = require('fs');

async function testTextAnalysis() {
  console.log('Testing Contract Analysis with Text Input...\n');

  // Read the test contract content
  const contractContent = fs.readFileSync('test-contract.txt', 'utf8');

  try {
    const response = await fetch('http://localhost:3000/api/test-analyze', {
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
      console.log('\n✓ Successfully analyzed contract!');
      console.log('Contract ID:', result.contractId);
      console.log('Risk Level:', result.analysis?.riskLevel);
      console.log('Risk Score:', result.analysis?.riskScore);
      console.log('Summary:', result.analysis?.summary);
      console.log('Key Terms:', result.analysis?.keyTerms);
      console.log('Red Flags:', result.analysis?.redFlags);
      console.log('Favorable Terms:', result.analysis?.favorableTerms);
      console.log('Recommendations:', result.analysis?.recommendations);
    } else {
      console.log('\n✗ Failed to analyze contract');
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
}

// Run the test
testTextAnalysis().catch(console.error);
