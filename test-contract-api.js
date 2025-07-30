const fs = require('fs');
const path = require('path');

async function testContractAPI() {
  console.log('Testing Contract Analysis API...\n');

  // Test 1: Missing required fields
  console.log('Test 1: Missing required fields');
  try {
    const formData = new FormData();
    // Intentionally missing userId and organizationId
    
    const response = await fetch('http://localhost:3000/api/analyze-contract', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', result);
    console.log('✓ Correctly rejected missing fields\n');
  } catch (error) {
    console.log('✗ Error:', error.message, '\n');
  }

  // Test 2: Invalid file type
  console.log('Test 2: Invalid file type');
  try {
    const formData = new FormData();
    
    // Create a fake text file
    const textContent = 'This is a test contract content';
    const textBlob = new Blob([textContent], { type: 'text/plain' });
    const textFile = new File([textBlob], 'test.txt', { type: 'text/plain' });
    
    formData.append('file', textFile);
    formData.append('userId', 'demo-user-id');
    formData.append('organizationId', 'demo-org-id');
    
    const response = await fetch('http://localhost:3000/api/analyze-contract', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', result);
    console.log('✓ Correctly rejected invalid file type\n');
  } catch (error) {
    console.log('✗ Error:', error.message, '\n');
  }

  // Test 3: Valid request with text content (simulating PDF)
  console.log('Test 3: Valid request with simulated PDF');
  try {
    const formData = new FormData();
    
    // Read the test contract content
    const contractContent = fs.readFileSync('test-contract.txt', 'utf8');
    
    // Create a fake PDF file with contract content
    const pdfBlob = new Blob([contractContent], { type: 'application/pdf' });
    const pdfFile = new File([pdfBlob], 'test-contract.pdf', { type: 'application/pdf' });
    
    formData.append('file', pdfFile);
    formData.append('userId', 'demo-user-id');
    formData.append('organizationId', 'demo-org-id');
    
    const response = await fetch('http://localhost:3000/api/analyze-contract', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✓ Successfully analyzed contract');
      console.log('Contract ID:', result.contractId);
      console.log('Risk Level:', result.analysis?.riskLevel);
      console.log('Risk Score:', result.analysis?.riskScore);
    } else {
      console.log('✗ Failed to analyze contract');
    }
    console.log('');
  } catch (error) {
    console.log('✗ Error:', error.message, '\n');
  }

  console.log('Contract API testing completed.');
}

// Run the tests
testContractAPI().catch(console.error);
