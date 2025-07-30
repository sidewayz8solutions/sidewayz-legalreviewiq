#!/usr/bin/env python3
"""
Simple script to create basic PDF contracts using fpdf2 (lightweight PDF library)
"""

try:
    from fpdf import FPDF
except ImportError:
    print("fpdf2 not found. Trying to install...")
    import subprocess
    import sys
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "fpdf2"])
        from fpdf import FPDF
        print("Successfully installed fpdf2")
    except:
        print("Could not install fpdf2. Creating HTML versions instead...")
        
        def create_html_contracts():
            # Service Agreement HTML
            service_html = """
<!DOCTYPE html>
<html>
<head>
    <title>Service Agreement</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { text-align: center; color: #333; }
        h2 { color: #666; margin-top: 30px; }
        .signature { margin-top: 50px; }
        .signature-line { border-bottom: 1px solid #000; width: 200px; display: inline-block; margin: 0 20px; }
    </style>
</head>
<body>
    <h1>SERVICE AGREEMENT</h1>
    <p>This Service Agreement ("Agreement") is entered into on March 15, 2024, between TechCorp Solutions ("Client") and Digital Innovations LLC ("Provider").</p>
    
    <h2>1. SERVICES</h2>
    <p>Provider agrees to provide software development and consulting services including:</p>
    <ul>
        <li>Custom web application development</li>
        <li>Database design and implementation</li>
        <li>User interface design</li>
        <li>Testing and quality assurance</li>
    </ul>
    
    <h2>2. PAYMENT TERMS</h2>
    <p>Client agrees to pay a total of $75,000 as follows:</p>
    <ul>
        <li>$25,000 upon signing this agreement</li>
        <li>$25,000 upon completion of Phase 1 (design and planning)</li>
        <li>$25,000 upon final delivery and acceptance</li>
    </ul>
    
    <h2>3. TERM AND TERMINATION</h2>
    <p>This agreement shall commence on March 15, 2024, and continue for 6 months unless terminated earlier. Either party may terminate this agreement with 14 days written notice. Upon termination, Client shall pay for all work completed to date.</p>
    
    <h2>4. INTELLECTUAL PROPERTY</h2>
    <p>All work product, including source code, designs, and documentation, shall be owned exclusively by Provider until final payment is received, at which point ownership transfers to Client.</p>
    
    <h2>5. LIABILITY AND WARRANTIES</h2>
    <p>Provider's total liability under this agreement shall not exceed $10,000. Provider makes no warranties regarding the software's performance in Client's specific environment.</p>
    
    <h2>6. GOVERNING LAW</h2>
    <p>This agreement shall be governed by the laws of New York State. Any disputes shall be resolved through binding arbitration.</p>
    
    <div class="signature">
        <p>TechCorp Solutions<span class="signature-line"></span> Digital Innovations LLC<span class="signature-line"></span></p>
        <p>Sarah Johnson, CEO<span style="margin-left: 100px;">Michael Chen, President</span></p>
    </div>
</body>
</html>
"""
            
            with open("test-service-agreement.html", "w") as f:
                f.write(service_html)
            
            # Employment Contract HTML
            employment_html = """
<!DOCTYPE html>
<html>
<head>
    <title>Employment Agreement</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { text-align: center; color: #333; }
        h2 { color: #666; margin-top: 30px; }
        .signature { margin-top: 50px; }
        .signature-line { border-bottom: 1px solid #000; width: 200px; display: inline-block; margin: 0 20px; }
    </style>
</head>
<body>
    <h1>EMPLOYMENT AGREEMENT</h1>
    <p>This Employment Agreement is entered into on April 1, 2024, between Innovative Tech Corp ("Company") and Alex Rodriguez ("Employee").</p>
    
    <h2>1. POSITION AND DUTIES</h2>
    <p>Employee is hired as Senior Software Engineer and agrees to perform duties including software development, code review, mentoring junior developers, and participating in architectural decisions.</p>
    
    <h2>2. COMPENSATION</h2>
    <p>Company agrees to pay Employee an annual salary of $120,000, payable bi-weekly. Employee is eligible for annual performance bonuses up to 20% of base salary.</p>
    
    <h2>3. BENEFITS</h2>
    <ul>
        <li>Health, dental, and vision insurance (Company pays 80%)</li>
        <li>401(k) with 4% company match</li>
        <li>20 days paid vacation annually</li>
        <li>10 days sick leave</li>
        <li>$2,000 annual professional development allowance</li>
    </ul>
    
    <h2>4. NON-COMPETE CLAUSE</h2>
    <p>For 12 months after termination, Employee agrees not to work for direct competitors within a 50-mile radius or solicit Company clients or employees.</p>
    
    <h2>5. TERMINATION</h2>
    <p>Either party may terminate this agreement with 2 weeks notice. Company may terminate immediately for cause. Upon termination, Employee must return all company property.</p>
    
    <div class="signature">
        <p>Innovative Tech Corp<span class="signature-line"></span> Employee<span class="signature-line"></span></p>
        <p>Jennifer Liu, HR Director<span style="margin-left: 80px;">Alex Rodriguez</span></p>
    </div>
</body>
</html>
"""
            
            with open("test-employment-contract.html", "w") as f:
                f.write(employment_html)
            
            print("✓ Created test-service-agreement.html")
            print("✓ Created test-employment-contract.html")
            print("\nYou can convert these HTML files to PDF using:")
            print("1. Open in browser and print to PDF")
            print("2. Use wkhtmltopdf: wkhtmltopdf file.html file.pdf")
            print("3. Use online HTML to PDF converters")
        
        create_html_contracts()
        exit()

def create_pdf_contract(filename, title, content):
    """Create a PDF contract with the given content"""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 16)
    
    # Title
    pdf.cell(0, 10, title, 0, 1, 'C')
    pdf.ln(10)
    
    # Content
    pdf.set_font('Arial', '', 11)
    for line in content:
        if line.startswith('**'):  # Bold headers
            pdf.set_font('Arial', 'B', 12)
            pdf.cell(0, 8, line.replace('**', ''), 0, 1)
            pdf.ln(2)
            pdf.set_font('Arial', '', 11)
        elif line.startswith('•'):  # Bullet points
            pdf.cell(10, 6, '', 0, 0)  # Indent
            pdf.cell(0, 6, line, 0, 1)
        elif line == '':  # Empty line
            pdf.ln(4)
        else:  # Regular text
            pdf.cell(0, 6, line, 0, 1)
            pdf.ln(1)
    
    pdf.output(filename)
    print(f"✓ Created {filename}")

def main():
    print("Creating PDF test contracts...")
    
    # Service Agreement
    service_content = [
        'This Service Agreement ("Agreement") is entered into on March 15, 2024, between',
        'TechCorp Solutions ("Client") and Digital Innovations LLC ("Provider").',
        '',
        '**1. SERVICES**',
        'Provider agrees to provide software development and consulting services including:',
        '• Custom web application development',
        '• Database design and implementation',
        '• User interface design',
        '• Testing and quality assurance',
        '',
        '**2. PAYMENT TERMS**',
        'Client agrees to pay a total of $75,000 as follows:',
        '• $25,000 upon signing this agreement',
        '• $25,000 upon completion of Phase 1 (design and planning)',
        '• $25,000 upon final delivery and acceptance',
        '',
        '**3. TERM AND TERMINATION**',
        'This agreement shall commence on March 15, 2024, and continue for 6 months',
        'unless terminated earlier. Either party may terminate this agreement with 14 days',
        'written notice. Upon termination, Client shall pay for all work completed to date.',
        '',
        '**4. INTELLECTUAL PROPERTY**',
        'All work product, including source code, designs, and documentation, shall be',
        'owned exclusively by Provider until final payment is received, at which point',
        'ownership transfers to Client.',
        '',
        '**5. LIABILITY AND WARRANTIES**',
        'Provider\'s total liability under this agreement shall not exceed $10,000.',
        'Provider makes no warranties regarding the software\'s performance in Client\'s',
        'specific environment.',
        '',
        '**6. GOVERNING LAW**',
        'This agreement shall be governed by the laws of New York State. Any disputes',
        'shall be resolved through binding arbitration.',
        '',
        'IN WITNESS WHEREOF, the parties have executed this Agreement as of the date',
        'first written above.',
        '',
        'TechCorp Solutions              Digital Innovations LLC',
        '_________________              _________________',
        'Sarah Johnson, CEO             Michael Chen, President'
    ]
    
    create_pdf_contract("test-service-agreement.pdf", "SERVICE AGREEMENT", service_content)
    
    # Employment Contract
    employment_content = [
        'This Employment Agreement is entered into on April 1, 2024, between',
        'Innovative Tech Corp ("Company") and Alex Rodriguez ("Employee").',
        '',
        '**1. POSITION AND DUTIES**',
        'Employee is hired as Senior Software Engineer and agrees to perform duties',
        'including software development, code review, mentoring junior developers,',
        'and participating in architectural decisions.',
        '',
        '**2. COMPENSATION**',
        'Company agrees to pay Employee an annual salary of $120,000, payable',
        'bi-weekly. Employee is eligible for annual performance bonuses up to 20%',
        'of base salary.',
        '',
        '**3. BENEFITS**',
        'Employee is entitled to:',
        '• Health, dental, and vision insurance (Company pays 80%)',
        '• 401(k) with 4% company match',
        '• 20 days paid vacation annually',
        '• 10 days sick leave',
        '• $2,000 annual professional development allowance',
        '',
        '**4. NON-COMPETE CLAUSE**',
        'For 12 months after termination, Employee agrees not to work for direct',
        'competitors within a 50-mile radius or solicit Company clients or employees.',
        '',
        '**5. TERMINATION**',
        'Either party may terminate this agreement with 2 weeks notice. Company may',
        'terminate immediately for cause. Upon termination, Employee must return all',
        'company property.',
        '',
        'By signing below, both parties agree to the terms of this Employment Agreement.',
        '',
        'Innovative Tech Corp           Employee',
        '_________________             _________________',
        'Jennifer Liu, HR Director     Alex Rodriguez'
    ]
    
    create_pdf_contract("test-employment-contract.pdf", "EMPLOYMENT AGREEMENT", employment_content)
    
    # Problematic Contract
    problematic_content = [
        'This Exclusive Vendor Agreement ("Agreement") is entered into on June 1, 2024,',
        'between MegaCorp Industries ("Company") and Small Business Solutions ("Vendor").',
        '',
        '**1. EXCLUSIVE SERVICES**',
        'Vendor agrees to provide ALL marketing and advertising services exclusively to',
        'Company. Vendor shall not provide any services to competitors or any other',
        'businesses in any industry without Company\'s written consent.',
        '',
        '**2. PAYMENT TERMS**',
        'Company agrees to pay Vendor based on performance metrics determined solely',
        'by Company. Payment amounts and timing are at Company\'s complete discretion.',
        'No minimum payment is guaranteed.',
        '',
        '**3. TERM AND RENEWAL**',
        'This agreement is for an initial term of 5 years and automatically renews for',
        'additional 5-year periods unless Vendor provides 12 months written notice.',
        'Company may terminate at any time with 24 hours notice.',
        '',
        '**4. NON-COMPETE AND NON-SOLICITATION**',
        'Vendor agrees not to compete with Company or provide services to any business',
        'in any industry for 10 years after termination. Vendor shall not solicit any',
        'Company employees, customers, or partners for 15 years.',
        '',
        '**5. TERMINATION PENALTIES**',
        'If Vendor terminates this agreement for any reason, Vendor must pay Company',
        '$100,000 as liquidated damages plus return all payments received during the',
        'agreement term.',
        '',
        '**6. LIABILITY**',
        'Vendor assumes all liability for any damages, losses, or claims arising from',
        'this agreement. Company\'s liability is limited to $1.',
        '',
        'MegaCorp Industries           Small Business Solutions',
        '_________________            _________________',
        'Richard Powers, CEO          Maria Garcia, Owner'
    ]
    
    create_pdf_contract("test-problematic-contract.pdf", "EXCLUSIVE VENDOR AGREEMENT", problematic_content)
    
    print("\n🎉 All PDF test contracts created successfully!")
    print("\nFiles created:")
    print("- test-service-agreement.pdf")
    print("- test-employment-contract.pdf")
    print("- test-problematic-contract.pdf")
    print("\nYou can now upload these PDFs to test the contract analyzer at:")
    print("http://localhost:3000/dashboard/contracts/upload")

if __name__ == "__main__":
    main()
