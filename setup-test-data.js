async function setupTestData() {
  try {
    const response = await fetch('http://localhost:3000/api/setup-test-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✓ Test data setup successful!');
    } else {
      console.log('✗ Test data setup failed');
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
}

setupTestData().catch(console.error);
