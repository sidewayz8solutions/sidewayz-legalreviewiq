#!/usr/bin/env python3
"""
Script to create test PDF contracts for the contract analyzer
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import os

def create_service_agreement():
    """Create a Service Agreement PDF"""
    doc = SimpleDocTemplate("test-service-agreement.pdf", pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=1  # Center alignment
    )
    
    story.append(Paragraph("SERVICE AGREEMENT", title_style))
    story.append(Spacer(1, 20))
    
    # Content
    content = [
        "This Service Agreement (\"Agreement\") is entered into on March 15, 2024, between TechCorp Solutions (\"Client\") and Digital Innovations LLC (\"Provider\").",
        "",
        "<b>1. SERVICES</b>",
        "Provider agrees to provide software development and consulting services including:",
        "• Custom web application development",
        "• Database design and implementation", 
        "• User interface design",
        "• Testing and quality assurance",
        "",
        "<b>2. PAYMENT TERMS</b>",
        "Client agrees to pay a total of $75,000 as follows:",
        "• $25,000 upon signing this agreement",
        "• $25,000 upon completion of Phase 1 (design and planning)",
        "• $25,000 upon final delivery and acceptance",
        "",
        "<b>3. TERM AND TERMINATION</b>",
        "This agreement shall commence on March 15, 2024, and continue for 6 months unless terminated earlier. Either party may terminate this agreement with 14 days written notice. Upon termination, Client shall pay for all work completed to date.",
        "",
        "<b>4. INTELLECTUAL PROPERTY</b>",
        "All work product, including source code, designs, and documentation, shall be owned exclusively by Provider until final payment is received, at which point ownership transfers to Client.",
        "",
        "<b>5. CONFIDENTIALITY</b>",
        "Both parties agree to maintain confidentiality of proprietary information shared during the course of this agreement for a period of 3 years.",
        "",
        "<b>6. LIABILITY AND WARRANTIES</b>",
        "Provider's total liability under this agreement shall not exceed $10,000. Provider makes no warranties regarding the software's performance in Client's specific environment.",
        "",
        "<b>7. GOVERNING LAW</b>",
        "This agreement shall be governed by the laws of New York State. Any disputes shall be resolved through binding arbitration.",
        "",
        "<b>8. FORCE MAJEURE</b>",
        "Neither party shall be liable for delays caused by circumstances beyond their reasonable control, including natural disasters, government actions, or pandemics.",
        "",
        "IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.",
        "",
        "TechCorp Solutions                    Digital Innovations LLC",
        "_________________                     _________________",
        "Sarah Johnson, CEO                    Michael Chen, President",
        "Date: ___________                     Date: ___________"
    ]
    
    for line in content:
        if line == "":
            story.append(Spacer(1, 12))
        else:
            story.append(Paragraph(line, styles['Normal']))
            story.append(Spacer(1, 6))
    
    doc.build(story)
    print("✓ Created test-service-agreement.pdf")

def create_employment_contract():
    """Create an Employment Contract PDF"""
    doc = SimpleDocTemplate("test-employment-contract.pdf", pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=1
    )
    
    story.append(Paragraph("EMPLOYMENT AGREEMENT", title_style))
    story.append(Spacer(1, 20))
    
    content = [
        "This Employment Agreement is entered into on April 1, 2024, between Innovative Tech Corp (\"Company\") and Alex Rodriguez (\"Employee\").",
        "",
        "<b>1. POSITION AND DUTIES</b>",
        "Employee is hired as Senior Software Engineer and agrees to perform duties including software development, code review, mentoring junior developers, and participating in architectural decisions.",
        "",
        "<b>2. COMPENSATION</b>",
        "Company agrees to pay Employee an annual salary of $120,000, payable bi-weekly. Employee is eligible for annual performance bonuses up to 20% of base salary.",
        "",
        "<b>3. BENEFITS</b>",
        "Employee is entitled to:",
        "• Health, dental, and vision insurance (Company pays 80%)",
        "• 401(k) with 4% company match",
        "• 20 days paid vacation annually",
        "• 10 days sick leave",
        "• $2,000 annual professional development allowance",
        "",
        "<b>4. WORK SCHEDULE</b>",
        "Employee's standard work schedule is Monday through Friday, 9:00 AM to 5:00 PM, with flexibility for remote work up to 3 days per week.",
        "",
        "<b>5. CONFIDENTIALITY AND NON-DISCLOSURE</b>",
        "Employee agrees to maintain strict confidentiality of all proprietary information, trade secrets, and client data. This obligation continues for 2 years after termination.",
        "",
        "<b>6. NON-COMPETE CLAUSE</b>",
        "For 12 months after termination, Employee agrees not to work for direct competitors within a 50-mile radius or solicit Company clients or employees.",
        "",
        "<b>7. TERMINATION</b>",
        "Either party may terminate this agreement with 2 weeks notice. Company may terminate immediately for cause. Upon termination, Employee must return all company property.",
        "",
        "<b>8. DISPUTE RESOLUTION</b>",
        "Any disputes shall be resolved through mediation, and if unsuccessful, binding arbitration under California state law.",
        "",
        "By signing below, both parties agree to the terms of this Employment Agreement.",
        "",
        "Innovative Tech Corp                  Employee",
        "_________________                     _________________",
        "Jennifer Liu, HR Director             Alex Rodriguez",
        "Date: ___________                     Date: ___________"
    ]
    
    for line in content:
        if line == "":
            story.append(Spacer(1, 12))
        else:
            story.append(Paragraph(line, styles['Normal']))
            story.append(Spacer(1, 6))
    
    doc.build(story)
    print("✓ Created test-employment-contract.pdf")

def create_rental_agreement():
    """Create a Rental Agreement PDF"""
    doc = SimpleDocTemplate("test-rental-agreement.pdf", pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=1
    )
    
    story.append(Paragraph("RESIDENTIAL LEASE AGREEMENT", title_style))
    story.append(Spacer(1, 20))
    
    content = [
        "This Lease Agreement is entered into on May 1, 2024, between Property Management LLC (\"Landlord\") and Emma Thompson (\"Tenant\").",
        "",
        "<b>1. PROPERTY</b>",
        "Landlord leases to Tenant the residential property located at 123 Oak Street, Apartment 2B, Springfield, IL 62701 (\"Premises\").",
        "",
        "<b>2. TERM</b>",
        "The lease term is 12 months, beginning May 1, 2024, and ending April 30, 2025. Tenant has no right to renew without Landlord's written consent.",
        "",
        "<b>3. RENT</b>",
        "Monthly rent is $1,800, due on the 1st of each month. Late fees of $50 apply after the 5th. Security deposit of $2,700 is required before move-in.",
        "",
        "<b>4. USE OF PREMISES</b>",
        "Premises shall be used solely as a private residence for Tenant and immediate family. No pets allowed without written permission. No smoking permitted.",
        "",
        "<b>5. MAINTENANCE AND REPAIRS</b>",
        "Landlord is responsible for major repairs and maintenance. Tenant is responsible for minor repairs under $100 and must maintain premises in good condition.",
        "",
        "<b>6. UTILITIES</b>",
        "Tenant is responsible for electricity, gas, internet, and cable. Landlord pays for water, sewer, and trash collection.",
        "",
        "<b>7. ALTERATIONS</b>",
        "No alterations or improvements may be made without Landlord's written consent. Any unauthorized changes may result in charges and lease termination.",
        "",
        "<b>8. ENTRY BY LANDLORD</b>",
        "Landlord may enter premises with 24-hour notice for inspections, repairs, or showing to prospective tenants during the last 30 days of lease.",
        "",
        "<b>9. TERMINATION</b>",
        "Lease may be terminated by Landlord for non-payment of rent, violation of lease terms, or illegal activities. 30-day notice required for non-renewal.",
        "",
        "<b>10. GOVERNING LAW</b>",
        "This agreement is governed by Illinois state law and local ordinances.",
        "",
        "Property Management LLC               Tenant",
        "_________________                     _________________",
        "Robert Davis, Manager                 Emma Thompson",
        "Date: ___________                     Date: ___________"
    ]
    
    for line in content:
        if line == "":
            story.append(Spacer(1, 12))
        else:
            story.append(Paragraph(line, styles['Normal']))
            story.append(Spacer(1, 6))
    
    doc.build(story)
    print("✓ Created test-rental-agreement.pdf")

if __name__ == "__main__":
    print("Creating test PDF contracts...")
    
    try:
        create_service_agreement()
        create_employment_contract()
        create_rental_agreement()
        print("\n🎉 All test PDF contracts created successfully!")
        print("\nFiles created:")
        print("- test-service-agreement.pdf")
        print("- test-employment-contract.pdf") 
        print("- test-rental-agreement.pdf")
        print("\nYou can now upload these PDFs to test the contract analyzer.")
    except ImportError:
        print("❌ Error: reportlab library not found.")
        print("Please install it with: pip install reportlab")
    except Exception as e:
        print(f"❌ Error creating PDFs: {e}")
