const fs = require('fs');

async function testProblematicContract() {
  console.log('🚨 Testing Problematic Contract Analysis...\n');

  // Read the problematic contract content
  const contractContent = fs.readFileSync('test-problematic-contract.txt', 'utf8');

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

    if (response.ok) {
      console.log('✅ PROBLEMATIC CONTRACT ANALYSIS SUCCESSFUL!\n');
      console.log('Contract ID:', result.contractId);
      console.log('🎯 Risk Level:', result.analysis?.riskLevel?.toUpperCase());
      console.log('📊 Risk Score:', result.analysis?.riskScore, '/100');
      
      console.log('\n📋 Summary:');
      console.log(result.analysis?.summary);
      
      console.log('\n🔑 Key Terms:');
      if (typeof result.analysis?.keyTerms === 'object') {
        Object.entries(result.analysis.keyTerms).forEach(([key, value]) => {
          console.log(`• ${key}: ${value}`);
        });
      } else if (Array.isArray(result.analysis?.keyTerms)) {
        result.analysis.keyTerms.forEach((term, i) => console.log(`${i + 1}. ${term}`));
      }
      
      console.log('\n🚩 RED FLAGS:');
      if (typeof result.analysis?.redFlags === 'object') {
        Object.entries(result.analysis.redFlags).forEach(([key, value]) => {
          console.log(`• ${key}: ${value}`);
        });
      } else if (Array.isArray(result.analysis?.redFlags)) {
        result.analysis.redFlags.forEach((flag, i) => console.log(`${i + 1}. ${flag}`));
      }
      
      console.log('\n✅ Favorable Terms:');
      if (typeof result.analysis?.favorableTerms === 'object') {
        Object.entries(result.analysis.favorableTerms).forEach(([key, value]) => {
          console.log(`• ${key}: ${value}`);
        });
      } else if (Array.isArray(result.analysis?.favorableTerms)) {
        result.analysis.favorableTerms.forEach((term, i) => console.log(`${i + 1}. ${term}`));
      }
      
      console.log('\n💡 RECOMMENDATIONS:');
      if (Array.isArray(result.analysis?.recommendations)) {
        result.analysis.recommendations.forEach((rec, i) => console.log(`${i + 1}. ${rec}`));
      } else if (typeof result.analysis?.recommendations === 'object') {
        Object.entries(result.analysis.recommendations).forEach(([key, value]) => {
          console.log(`• ${key}: ${value}`);
        });
      } else {
        console.log('No specific recommendations provided');
      }
      
      console.log('\n🎯 ANALYSIS SUMMARY:');
      if (result.analysis?.riskScore >= 75) {
        console.log('⚠️  HIGH RISK CONTRACT - Strongly recommend legal review before signing!');
      } else if (result.analysis?.riskScore >= 50) {
        console.log('⚠️  MEDIUM RISK CONTRACT - Consider legal consultation');
      } else {
        console.log('✅ LOW RISK CONTRACT - Generally acceptable terms');
      }
      
    } else {
      console.log('❌ Analysis failed');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run the test
testProblematicContract().catch(console.error);
