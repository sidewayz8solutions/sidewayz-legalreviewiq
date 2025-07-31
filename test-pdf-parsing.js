// Test PDF parsing functionality
const fs = require('fs');
const FormData = require('form-data');

async function testPDFParsing() {
  try {
    const fetch = (await import('node-fetch')).default;

    console.log('Testing file upload and parsing...');

    // Use the existing text file for testing
    const testFile = 'test-contract.txt';

    if (!fs.existsSync(testFile)) {
      console.log('Test file not found:', testFile);
      return;
    }

    console.log(`Testing with file: ${testFile}`);

    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFile), {
      filename: 'test-contract.txt',
      contentType: 'text/plain'
    });
    formData.append('userId', 'test-user');
    formData.append('organizationId', 'test-org');

    // Test the analyze-contract endpoint (this will fail due to unsupported file type)
    console.log('Testing with text file (should show unsupported file type error)...');
    const response = await fetch('http://localhost:3000/api/analyze-contract', {
      method: 'POST',
      body: formData
    });

    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', result);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testPDFParsing();
