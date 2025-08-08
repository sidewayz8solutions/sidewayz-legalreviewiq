#!/usr/bin/env python3
"""
Create a simple, clean PDF contract for testing
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

def create_simple_contract():
    """Create a simple, clean contract PDF"""
    doc = SimpleDocTemplate("simple-test-contract.pdf", pagesize=letter,
                           rightMargin=72, leftMargin=72,
                           topMargin=72, bottomMargin=18)
    
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title = Paragraph("SERVICE AGREEMENT", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))
    
    # Contract content
    content = [
        "This Service Agreement is entered into between:",
        "",
        "CLIENT: ABC Company",
        "SERVICE PROVIDER: XYZ Services",
        "",
        "1. SERVICES",
        "Provider will deliver web development services including:",
        "- Website design and development",
        "- Monthly maintenance and updates",
        "- Technical support",
        "",
        "2. PAYMENT TERMS",
        "- Total contract value: $5,000",
        "- Payment: 50% upfront, 50% on completion",
        "- Late fees: 1.5% per month on overdue amounts",
        "",
        "3. TERM",
        "- Contract duration: 3 months",
        "- Either party may terminate with 30 days notice",
        "",
        "4. INTELLECTUAL PROPERTY",
        "- All work product belongs to Client",
        "- Provider retains rights to general methodologies",
        "",
        "5. LIABILITY",
        "- Provider liability limited to contract value",
        "- No warranties for third-party services",
        "",
        "6. CONFIDENTIALITY",
        "Both parties agree to maintain confidentiality of proprietary information.",
        "",
        "By signing below, parties agree to these terms.",
        "",
        "CLIENT: _________________ DATE: _______",
        "",
        "PROVIDER: _______________ DATE: _______"
    ]
    
    for line in content:
        if line == "":
            story.append(Spacer(1, 6))
        else:
            para = Paragraph(line, styles['Normal'])
            story.append(para)
            story.append(Spacer(1, 3))
    
    doc.build(story)
    print("✓ Created simple-test-contract.pdf")

if __name__ == "__main__":
    create_simple_contract()
