// Simple test script to test the contract analyzer
const testContract = `
EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on January 1, 2024, between ABC Corporation ("Company") and John Doe ("Employee").

1. POSITION AND DUTIES
Employee shall serve as Software Engineer and shall perform duties as assigned by the Company.

2. COMPENSATION
Company shall pay Employee a salary of $80,000 per year, payable in accordance with Company's standard payroll practices.

3. TERMINATION
This Agreement may be terminated by either party with 30 days written notice. Upon termination, Employee shall return all Company property.

4. CONFIDENTIALITY
Employee agrees to maintain confidentiality of all proprietary information and trade secrets of the Company.

5. LIABILITY
Employee shall indemnify and hold harmless the Company from any claims arising from Employee's negligent acts.

6. GOVERNING LAW
This Agreement shall be governed by the laws of California.
`;

async function testAnalyzer() {
  try {
    console.log('Testing contract analyzer...');
    
    const response = await fetch('http://localhost:3000/api/test-analyzer-only', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contractText: testContract
      })
    });

    const result = await response.json();
    console.log('Analysis result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAnalyzer();
