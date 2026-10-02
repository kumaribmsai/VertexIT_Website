#!/usr/bin/env python3
"""
Generate VertexIT resource PDFs with brand styling.
Outputs to /home/z/my-project/public/downloads/guides/
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    ListFlowable, ListItem, KeepTogether, HRFlowable
)

# VertexIT brand colors
NAVY = HexColor("#0B2545")
TEAL = HexColor("#0E9E8E")
TEAL_LIGHT = HexColor("#5EEAD4")
SLATE = HexColor("#475569")
SLATE_LIGHT = HexColor("#94A3B8")
SILVER = HexColor("#E2E8F0")
BG_LIGHT = HexColor("#F8FAFC")

OUTPUT_DIR = "/home/z/my-project/public/downloads/guides"
os.makedirs(OUTPUT_DIR, exist_ok=True)

PAGE_W, PAGE_H = A4
MARGIN = 20 * mm

styles = getSampleStyleSheet()

style_title = ParagraphStyle("VTTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=26, leading=32, textColor=NAVY, alignment=TA_LEFT, spaceAfter=6)
style_eyebrow = ParagraphStyle("VTEyebrow", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=TEAL, alignment=TA_LEFT, spaceAfter=4)
style_h1 = ParagraphStyle("VTH1", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=18, leading=24, textColor=NAVY, spaceBefore=18, spaceAfter=8)
style_h2 = ParagraphStyle("VTH2", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=NAVY, spaceBefore=14, spaceAfter=6)
style_h3 = ParagraphStyle("VTH3", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=TEAL, spaceBefore=10, spaceAfter=4)
style_body = ParagraphStyle("VTBody", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.5, leading=16, textColor=HexColor("#1E293B"), alignment=TA_JUSTIFY, spaceAfter=8)
style_bullet = ParagraphStyle("VTBullet", parent=style_body, leftIndent=16, bulletIndent=4, spaceAfter=4)
style_question = ParagraphStyle("VTQuestion", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=11, leading=16, textColor=NAVY, spaceBefore=10, spaceAfter=4)
style_answer = ParagraphStyle("VTAnswer", parent=style_body, leftIndent=12, fontSize=10, leading=15, spaceAfter=8)


def header_footer(canv, doc):
    canv.saveState()
    canv.setFillColor(NAVY)
    canv.rect(0, PAGE_H - 12 * mm, PAGE_W, 12 * mm, fill=1, stroke=0)
    canv.setFillColor(white)
    canv.setFont("Helvetica-Bold", 10)
    canv.drawString(MARGIN, PAGE_H - 8 * mm, "VertexIT")
    canv.setFillColor(TEAL_LIGHT)
    canv.setFont("Helvetica-Bold", 7)
    canv.drawString(MARGIN + 50, PAGE_H - 8 * mm, "LEARN • APPLY")
    canv.setFillColor(SLATE_LIGHT)
    canv.setFont("Helvetica", 8)
    canv.drawRightString(PAGE_W - MARGIN, PAGE_H - 8 * mm, f"Page {doc.page}")
    canv.setStrokeColor(SILVER)
    canv.setLineWidth(0.5)
    canv.line(MARGIN, 15 * mm, PAGE_W - MARGIN, 15 * mm)
    canv.setFillColor(SLATE_LIGHT)
    canv.setFont("Helvetica", 7.5)
    canv.drawString(MARGIN, 10 * mm, "VertexIT · Mortgage Training & Placement Assistance · Bengaluru")
    canv.drawRightString(PAGE_W - MARGIN, 10 * mm, "vertexit.in  ·  +91 97036 86514")
    canv.restoreState()


def cover_page(title, subtitle, description):
    flow = []
    flow.append(Spacer(1, 60 * mm))
    badge_table = Table(
        [[Paragraph('<font color="white"><b>VT</b></font>', ParagraphStyle("badge", fontSize=24, alignment=TA_CENTER))]],
        colWidths=[40 * mm], rowHeights=[40 * mm],
    )
    badge_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    flow.append(badge_table)
    flow.append(Spacer(1, 12 * mm))
    flow.append(Paragraph("VERTEXIT RESOURCE", style_eyebrow))
    flow.append(Paragraph(title, style_title))
    flow.append(Spacer(1, 4 * mm))
    if subtitle:
        flow.append(Paragraph(f'<font color="#475569" size="13">{subtitle}</font>', ParagraphStyle("sub", fontName="Helvetica", fontSize=13, leading=18, textColor=SLATE)))
    flow.append(Spacer(1, 8 * mm))
    if description:
        flow.append(Paragraph(description, ParagraphStyle("desc", fontName="Helvetica", fontSize=11, leading=16, textColor=SLATE, alignment=TA_JUSTIFY)))
    flow.append(Spacer(1, 20 * mm))
    flow.append(HRFlowable(width="30%", thickness=2, color=TEAL, spaceBefore=4, spaceAfter=8))
    flow.append(Paragraph(
        '<font color="#94A3B8" size="9">Free career resource from VertexIT — LEARN • APPLY<br/>Educational content. Not legal or regulatory advice.</font>',
        ParagraphStyle("note", fontName="Helvetica", fontSize=9, leading=13, textColor=SLATE_LIGHT)
    ))
    flow.append(PageBreak())
    return flow


def make_bullets(items, style=style_bullet):
    return ListFlowable(
        [ListItem(Paragraph(item, style), leftIndent=12, value="•") for item in items],
        bulletType="bullet", bulletColor=TEAL, leftIndent=16,
    )


def section_heading(text, style=style_h1):
    return KeepTogether([
        Paragraph(text, style),
        HRFlowable(width="100%", thickness=0.5, color=SILVER, spaceBefore=2, spaceAfter=8),
    ])


def info_box(title, body, bg=BG_LIGHT, border=TEAL):
    inner = [
        [Paragraph(f'<b>{title}</b>', ParagraphStyle("boxtitle", fontName="Helvetica-Bold", fontSize=10, textColor=NAVY))],
        [Paragraph(body, ParagraphStyle("boxbody", fontName="Helvetica", fontSize=9.5, leading=14, textColor=SLATE))],
    ]
    t = Table(inner, colWidths=[PAGE_W - 2 * MARGIN - 8])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LINEBEFORE", (0, 0), (0, -1), 3, border),
    ]))
    return t


def guide_interview_questions():
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, "mortgage-underwriting-interview-questions.pdf"),
        pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=18 * mm, bottomMargin=20 * mm,
        title="US Mortgage Underwriting Interview Questions — VertexIT",
        author="VertexIT", subject="Mortgage Underwriting Interview Preparation Guide", creator="VertexIT",
    )
    story = []
    story += cover_page(
        "US Mortgage Underwriting<br/>Interview Questions",
        "25 common questions with sample answers",
        "A practical guide for candidates preparing for US Mortgage Underwriting interviews. Includes common questions, what hiring teams look for, and sample answer frameworks.",
    )
    story.append(section_heading("How to use this guide"))
    story.append(Paragraph("This guide covers 25 common interview questions for US Mortgage Underwriting roles. For each question, you will find what the interviewer looks for and a sample answer framework. Adapt these to your own experience.", style_body))
    story.append(info_box("Important note", "Interview questions vary by employer and role level. This guide covers common conceptual and scenario-based questions. Use it as a starting point, not a complete script."))
    story.append(Spacer(1, 6 * mm))

    story.append(section_heading("1. Conceptual questions"))
    story.append(Paragraph("These questions test your understanding of the mortgage industry and underwriting fundamentals. Answer concisely, showing you understand both the concept and its practical application.", style_body))

    qa = [
        ("Q1. Walk me through the US mortgage lifecycle.",
         "What they look for: Clear understanding of the end-to-end loan journey.<br/><br/>Sample framework: Start with loan application (1003), move through processing, underwriting, conditions, clear-to-close, and finally closing/funding. Mention key documents at each stage and the role of the underwriter."),
        ("Q2. What are the main loan types you are familiar with?",
         "What they look for: Awareness of conventional, FHA, VA and other products.<br/><br/>Sample framework: Conventional (conforming to Fannie Mae / Freddie Mac), FHA (government-backed, lower down payment), VA (for veterans), and non-conforming/jumbo loans."),
        ("Q3. What is DTI and why does it matter?",
         "What they look for: Understanding of Debt-to-Income ratio.<br/><br/>Sample framework: DTI compares monthly debt obligations to gross monthly income. Front-end (housing) ratio and back-end (total) ratio. Most conventional loans target ≤43% back-end DTI."),
        ("Q4. Explain LTV and CLTV.",
         "What they look for: Understanding of Loan-to-Value ratios.<br/><br/>Sample framework: LTV = loan amount ÷ property value. CLTV includes all liens. Higher LTV = higher risk. Conventional loans often cap at 80% LTV without mortgage insurance; FHA allows up to 96.5% LTV."),
        ("Q5. What is AUS and which systems are you familiar with?",
         "What they look for: Knowledge of Automated Underwriting Systems.<br/><br/>Sample framework: AUS evaluates loan files against guidelines. Two main systems: Fannie Mae's Desktop Underwriter (DU) and Freddie Mac's Loan Product Advisor (LPA)."),
        ("Q6. What is the role of Fannie Mae and Freddie Mac?",
         "What they look for: Understanding of Government Sponsored Enterprises (GSEs).<br/><br/>Sample framework: Fannie Mae and Freddie Mac are GSEs that buy conforming loans from lenders, providing liquidity to the mortgage market."),
        ("Q7. What documents do you review during underwriting?",
         "What they look for: Practical familiarity with the loan file.<br/><br/>Sample framework: 1003 application, credit report, income docs (W-2s, paystubs, tax returns), asset statements, appraisal, title commitment, and AUS findings."),
        ("Q8. How do you assess a self-employed borrower?",
         "What they look for: Understanding of self-employed income analysis.<br/><br/>Sample framework: Review 2 years of personal and business tax returns. Calculate income from Schedule C, K-1s, or 1120/1120S. Look for stable or increasing income."),
        ("Q9. What red flags would you look for in a loan file?",
         "What they look for: Risk awareness and attention to detail.<br/><br/>Sample framework: Large undocumented deposits, recent credit inquiries, employment gaps, income that doesn't match industry norms, property flips, and inconsistent information."),
        ("Q10. What is the difference between a condition and a denial?",
         "What they look for: Understanding of the underwriting decision process.<br/><br/>Sample framework: Conditions are requirements that must be met before clear-to-close. Denial means the loan does not meet guidelines; the borrower receives an adverse action notice."),
    ]
    for q, a in qa:
        story.append(Paragraph(q, style_question))
        story.append(Paragraph(a, style_answer))

    story.append(PageBreak())
    story.append(section_heading("2. Scenario-based questions"))
    story.append(Paragraph("These questions present realistic situations. Structure your answer using STAR (Situation, Task, Action, Result) or a clear problem-solution-outcome format.", style_body))

    scenarios = [
        ("Q11. A borrower's DTI is 47%, just above the 43% guideline. How would you handle this?",
         "Sample framework: Check if the loan is eligible for AUS approval — many GSE loans allow higher DTI with strong compensating factors. Look for reserves, low LTV, or strong credit. If not eligible, discuss options with the loan officer."),
        ("Q12. You notice a large $25,000 deposit in the borrower's bank statement that isn't documented. What do you do?",
         "Sample framework: Large undocumented deposits are a common red flag. Require a letter of explanation from the borrower and source documentation. If the source cannot be verified, the funds may need to be removed from available assets."),
        ("Q13. A borrower is a W-2 employee but also has a side business. How do you calculate income?",
         "Sample framework: Use W-2 income as primary. For the side business, review 2 years of Schedule C / business returns. If the business shows a loss, it may reduce qualifying income."),
        ("Q14. The appraisal comes in $15,000 below the purchase price. What are the options?",
         "Sample framework: Options include: renegotiate price with seller, borrower makes up the difference in cash, cancel the contract, or order a second appraisal. LTV is calculated on appraised value, not purchase price."),
        ("Q15. How would you prioritise your pipeline if you have 20 files due this week?",
         "Sample framework: Prioritise by closing date (soonest first), then by complexity. Flag any files missing documentation. Communicate with loan officers on any files at risk of missing closing dates."),
    ]
    for q, a in scenarios:
        story.append(Paragraph(q, style_question))
        story.append(Paragraph(a, style_answer))

    story.append(PageBreak())
    story.append(section_heading("3. Behavioural questions"))
    story.append(Paragraph("These questions assess your work style and communication. Use the STAR method: describe the Situation, the Task, the Action you took, and the Result.", style_body))

    behavioural = [
        ("Q16. Tell me about a time you caught a critical error in a file.",
         "Sample framework: Describe the file, the error, how you caught it, and the outcome. Highlight your diligence and the positive result."),
        ("Q17. Describe a time you disagreed with a loan officer on a decision.",
         "Sample framework: Focus on professional communication. State your position based on guidelines, listen to their perspective, and escalate if needed."),
        ("Q18. How do you handle pressure during busy periods?",
         "Sample framework: Describe your time management approach — prioritisation, communication, and knowing when to ask for help."),
        ("Q19. Tell me about a time you had to learn a new guideline quickly.",
         "Sample framework: Show your ability to learn and adapt. Describe how you approached learning and how you applied it."),
        ("Q20. How do you ensure accuracy in your work?",
         "Sample framework: Describe your review process — checklists, peer review, double-checking calculations."),
    ]
    for q, a in behavioural:
        story.append(Paragraph(q, style_question))
        story.append(Paragraph(a, style_answer))

    story.append(Spacer(1, 8 * mm))
    story.append(section_heading("4. Questions to ask the interviewer"))
    story.append(Paragraph("At the end of the interview, you will usually be invited to ask questions. Asking thoughtful questions shows your interest:", style_body))
    story.append(make_bullets([
        "What does a typical day look like in this role?",
        "What loan systems (LOS, AUS) does the team use?",
        "How is the underwriting team structured?",
        "What are the key metrics the team is measured on?",
        "What does the training and onboarding process look like?",
        "What are the biggest challenges the team is facing right now?",
    ]))

    story.append(Spacer(1, 8 * mm))
    story.append(info_box("Final tip", "Practice your answers out loud before the interview. Mock interviews with feedback are one of the most effective preparation tools. VertexIT's US Mortgage Underwriting program includes role-specific mock interviews as part of the placement assistance.", bg=HexColor("#ECFEF7")))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph(
        '<font color="#94A3B8" size="9">This guide is an educational resource from VertexIT. Interview questions and expectations vary by employer. Speak with a VertexIT counsellor for personalised interview preparation. Visit vertexit.in or WhatsApp +91 97036 86514.</font>',
        ParagraphStyle("endnote", fontName="Helvetica", fontSize=9, leading=13, textColor=SLATE_LIGHT)
    ))
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print("✓ Generated: mortgage-underwriting-interview-questions.pdf")


def guide_career_pathways():
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, "mortgage-career-pathways-guide.pdf"),
        pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=18 * mm, bottomMargin=20 * mm,
        title="Mortgage Career Pathways Guide — VertexIT",
        author="VertexIT", subject="Career Pathways in Mortgage Operations", creator="VertexIT",
    )
    story = []
    story += cover_page(
        "Mortgage Career<br/>Pathways Guide",
        "Explore careers in mortgage and lending operations",
        "A practical overview of the career pathways available in the US and Australian mortgage industry — from entry-level processing roles to senior underwriting and operations positions.",
    )

    story.append(section_heading("Why mortgage operations?"))
    story.append(Paragraph("The mortgage and lending operations industry offers stable, career-focused roles for graduates and career switchers. The US mortgage market is one of the largest in the world, with consistent demand for trained underwriters, processors and operations analysts. The Australian mortgage market similarly offers growing opportunities, particularly in broker support and lending operations.", style_body))
    story.append(Paragraph("These roles are well-suited for candidates who enjoy structured processes, attention to detail, and analytical problem-solving. Many positions offer hybrid or remote work, and the skills are transferable across employers and geographies.", style_body))

    story.append(section_heading("US Mortgage career pathways"))
    story.append(Paragraph("The US mortgage industry has a well-defined career ladder. Here are the main roles and how candidates typically progress:", style_body))

    us_roles = [
        ("Loan Processor", "Entry-level", "Collects and organises loan documentation, verifies data entry, and prepares the file for underwriting. Good starting point to learn the loan lifecycle."),
        ("Underwriting Assistant / Junior Underwriter", "Entry to mid-level", "Supports underwriters with file review, condition tracking, and AUS submissions. Builds underwriting knowledge."),
        ("Mortgage Underwriter", "Mid-level", "Assesses loan files against guidelines, makes approve/suspend/deny decisions, and issues conditions. Core analytical role."),
        ("Senior Underwriter / DE Underwriter", "Senior", "Handles complex files, mentors junior underwriters, and may have direct endorsement (DE) authority for FHA loans."),
        ("Underwriting Manager / Team Lead", "Leadership", "Manages a team of underwriters, handles escalations, and ensures quality and turnaround standards."),
    ]
    for role, level, desc in us_roles:
        story.append(Paragraph(f'<b>{role}</b> <font color="#0E9E8E">· {level}</font>', style_h3))
        story.append(Paragraph(desc, style_body))

    story.append(info_box("Skills that help you progress", "Strong analytical ability, attention to detail, Fannie Mae / Freddie Mac guideline awareness, AUS interpretation (DU/LPA), income analysis (W-2 and self-employed), and clear written communication. VertexIT's US Mortgage Underwriting program builds these skills through case-study based practice."))

    story.append(PageBreak())
    story.append(section_heading("Australia Mortgage career pathways"))
    story.append(Paragraph("The Australian mortgage industry offers distinct pathways, often structured around broker support and lending operations rather than centralised underwriting. Key roles include:", style_body))

    au_roles = [
        ("Mortgage Loan Processor", "Entry to mid-level", "Processes loan applications, collects and verifies documentation, and supports the broker or lender through to settlement."),
        ("Broker Support Associate", "Mid-level", "Supports mortgage brokers day-to-day — managing pipelines, preparing submissions, and following up with lenders."),
        ("Loan Administration Analyst", "Mid-level", "Handles post-settlement administration — disbursements, compliance checks, and ongoing loan maintenance."),
        ("Mortgage Broker Virtual Assistant", "Mid-level", "Provides remote operational support to brokers — communication, documentation, and submission management."),
        ("Lending Operations Analyst", "Senior", "Oversees lending operations workflows, manages compliance, and optimises processes across the loan lifecycle."),
    ]
    for role, level, desc in au_roles:
        story.append(Paragraph(f'<b>{role}</b> <font color="#0E9E8E">· {level}</font>', style_h3))
        story.append(Paragraph(desc, style_body))

    story.append(info_box("Important note on Australian licensing", "VertexIT's Australia Mortgage program prepares candidates for mortgage and lending operations support roles. It does not automatically confer Australian mortgage broker licensing. Licensing requirements vary by jurisdiction and are separate from this training.", bg=HexColor("#FEF3C7"), border=HexColor("#F59E0B")))

    story.append(PageBreak())
    story.append(section_heading("How to start your mortgage career"))
    story.append(Paragraph("Regardless of which pathway you choose, the steps to enter the mortgage industry are similar:", style_body))
    story.append(make_bullets([
        "Build foundational knowledge — mortgage lifecycle, loan types, key ratios (DTI, LTV), and AUS concepts.",
        "Develop practical skills through case-study based practice — reading loan files, calculating ratios.",
        "Prepare a mortgage-focused resume that highlights relevant training and analytical skills.",
        "Practice interview questions specific to mortgage operations roles.",
        "Apply for entry-level roles (processor, assistant, support) as a stepping stone to underwriting.",
        "Network with professionals in the industry and attend mortgage industry events where possible.",
    ]))

    story.append(Spacer(1, 6 * mm))
    story.append(section_heading("Skills that hiring teams look for"))
    story.append(Paragraph("Across both US and Australian mortgage roles, hiring teams consistently look for:", style_body))
    skills_data = [
        ["Skill", "Why it matters"],
        ["Attention to detail", "Loan files involve many documents and calculations — errors can be costly"],
        ["Analytical thinking", "Assessing risk requires weighing multiple factors against guidelines"],
        ["Written communication", "Clear conditions and explanations are essential"],
        ["Time management", "Underwriters handle multiple files with closing deadlines"],
        ["Guideline awareness", "Knowing Fannie Mae / Freddie Mac / lender guidelines speeds up decisions"],
        ["AUS interpretation", "Understanding DU/LPA findings is core to modern underwriting"],
    ]
    skills_table = Table(skills_data, colWidths=[55 * mm, 115 * mm])
    skills_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9.5),
        ("TEXTCOLOR", (0, 1), (-1, -1), HexColor("#1E293B")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, BG_LIGHT]),
        ("LINEBELOW", (0, 0), (-1, 0), 1, TEAL),
    ]))
    story.append(skills_table)

    story.append(Spacer(1, 8 * mm))
    story.append(info_box("Ready to start?", "VertexIT offers career-focused training in US Mortgage Underwriting and Australia Mortgage Operations, with placement assistance, mock interviews, and resume guidance. Speak with a counsellor to find the right path for your goals. Visit vertexit.in or WhatsApp +91 97036 86514.", bg=HexColor("#ECFEF7")))

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print("✓ Generated: mortgage-career-pathways-guide.pdf")


def guide_fundamentals_cheatsheet():
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, "us-mortgage-fundamentals-cheatsheet.pdf"),
        pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=18 * mm, bottomMargin=20 * mm,
        title="US Mortgage Fundamentals Cheat Sheet — VertexIT",
        author="VertexIT", subject="US Mortgage Fundamentals Quick Reference", creator="VertexIT",
    )
    story = []
    story += cover_page(
        "US Mortgage Fundamentals<br/>Cheat Sheet",
        "Quick reference for key concepts",
        "A quick-reference guide covering the essential concepts of US mortgage underwriting — loan types, key ratios, documentation, and AUS. Perfect for last-minute revision before interviews or as a daily desk reference.",
    )

    story.append(section_heading("Loan types"))
    loan_types = [
        ["Type", "Description", "Key feature"],
        ["Conventional", "Non-government-backed loan", "Conforms to Fannie/Freddie guidelines"],
        ["FHA", "Federal Housing Administration", "Low down payment (3.5%), up to 96.5% LTV"],
        ["VA", "Department of Veterans Affairs", "For eligible veterans, 0% down possible"],
        ["Jumbo", "Non-conforming loan", "Exceeds conforming loan limits"],
        ["USDA", "Rural Development loan", "For eligible rural areas, 0% down"],
    ]
    t = Table(loan_types, colWidths=[30 * mm, 60 * mm, 80 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, BG_LIGHT]),
    ]))
    story.append(t)

    story.append(section_heading("Key ratios"))
    story.append(Paragraph("<b>DTI (Debt-to-Income Ratio)</b>", style_h3))
    story.append(Paragraph("Measures monthly debt obligations against gross monthly income. Front-end (housing) ratio = PITIA ÷ gross monthly income. Back-end (total) ratio = (PITIA + all other debts) ÷ gross monthly income. Target: ≤43% back-end for most conventional loans (AUS may allow higher with compensating factors).", style_body))
    story.append(Paragraph("<b>LTV (Loan-to-Value)</b>", style_h3))
    story.append(Paragraph("Measures the loan amount against the property value. LTV = loan amount ÷ appraised value. Conventional: typically 80% LTV without PMI; up to 97% with PMI. FHA: up to 96.5% LTV.", style_body))
    story.append(Paragraph("<b>CLTV (Combined LTV)</b>", style_h3))
    story.append(Paragraph("Includes all liens on the property. CLTV = (first mortgage + second mortgage) ÷ appraised value. HCLTV (Home Equity Combined LTV): used when a HELOC is present, considers the drawn portion of the line.", style_body))

    story.append(section_heading("Key documents"))
    docs = [
        ["Document", "Purpose"],
        ["1003 (URLA)", "Uniform Residential Loan Application — the standard application form"],
        ["Credit report", "Shows borrower's credit history, scores, and tradelines"],
        ["W-2 / Paystub", "Verifies employment and income for W-2 borrowers"],
        ["Tax returns (1040)", "2 years required for self-employed or complex income"],
        ["Bank statements", "Verifies assets and sources of funds"],
        ["Appraisal (1004)", "Independent valuation of the property"],
        ["Title commitment", "Confirms property title and any liens"],
        ["AUS findings", "DU/LPA output — approve/eligible or refer/ineligible"],
    ]
    t = Table(docs, colWidths=[45 * mm, 125 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, BG_LIGHT]),
    ]))
    story.append(t)

    story.append(section_heading("AUS (Automated Underwriting Systems)"))
    story.append(Paragraph("Desktop Underwriter (DU) — Fannie Mae's AUS. Loan Product Advisor (LPA) — Freddie Mac's AUS. Common findings: Approve/Eligible (loan meets guidelines), Refer/Ineligible (needs manual review or doesn't qualify). Findings come with conditions that must be met.", style_body))

    story.append(section_heading("Underwriting decision"))
    story.append(make_bullets([
        "<b>Approve</b> — loan meets guidelines, issue conditions for clear-to-close",
        "<b>Suspend</b> — more information required before a decision",
        "<b>Deny</b> — loan does not meet guidelines; adverse action notice issued",
    ]))

    story.append(section_heading("Income types"))
    story.append(make_bullets([
        "<b>W-2 income</b> — base salary, bonus, overtime (2-year history for variable)",
        "<b>Self-employed</b> — Schedule C, K-1, 1120/1120S (2-year average)",
        "<b>Rental income</b> — from investment properties (75% of rent used for vacancy/maintenance)",
        "<b>Asset income</b> — interest, dividends, retirement distributions",
    ]))

    story.append(Spacer(1, 6 * mm))
    story.append(info_box("Disclaimer", "This cheat sheet is for educational purposes only. Underwriting guidelines vary by lender, loan type, and GSE updates. Always refer to current selling guides and internal policies. VertexIT training covers these concepts in depth with case-study based practice."))

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print("✓ Generated: us-mortgage-fundamentals-cheatsheet.pdf")


def guide_resume_template():
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, "mortgage-operations-resume-template.pdf"),
        pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=18 * mm, bottomMargin=20 * mm,
        title="Mortgage Operations Resume Template — VertexIT",
        author="VertexIT", subject="ATS-Optimised Resume Template for Mortgage Operations", creator="VertexIT",
    )
    story = []
    story += cover_page(
        "Mortgage Operations<br/>Resume Template",
        "ATS-optimised format for mortgage roles",
        "A recruiter-friendly resume template tailored for mortgage operations and underwriting roles. Includes section-by-section guidance, a sample resume, and tips for ATS optimisation. Use this as a starting point and adapt it to your experience.",
    )

    story.append(section_heading("How to use this template"))
    story.append(Paragraph("This guide provides a resume structure that works well for mortgage operations and underwriting roles. It is optimised for Applicant Tracking Systems (ATS) — meaning it uses a clean, single-column layout with standard section headings that ATS software can parse reliably.", style_body))
    story.append(info_box("ATS tip", "Avoid tables, columns, graphics, and unusual fonts in your resume. ATS software may not parse them correctly. Use a simple single-column layout with standard headings (Experience, Education, Skills)."))
    story.append(Spacer(1, 6 * mm))

    story.append(section_heading("Resume structure"))
    story.append(Paragraph("Use these sections in order. Each is explained below with sample content.", style_body))

    sections = [
        ("1. Header (Contact Information)",
         "Place your name, phone, email, location (city, state), and LinkedIn URL at the top. Keep it simple — no photos or graphics.",
         "Sample:\n\nAarav Sharma\nBengaluru, Karnataka  ·  +91 98765 43210  ·  aarav.sharma@email.com\nlinkedin.com/in/aaravsharma"),
        ("2. Professional Summary (2-3 lines)",
         "A brief summary highlighting your mortgage operations knowledge and career goal. Tailor it to the role you are applying for.",
         "Sample:\n\nDetail-oriented graduate with structured training in US Mortgage Underwriting. Skilled in loan file analysis, DTI/LTV calculations, and AUS interpretation. Seeking an entry-level underwriting or processing role to apply practical, case-study based knowledge."),
        ("3. Core Skills",
         "List 6-8 key skills relevant to mortgage operations. Use a bulleted list — ATS systems look for keyword matches.",
         "Sample:\n\n• US Mortgage Underwriting fundamentals  • DTI, LTV, CLTV ratio calculation\n• AUS interpretation (DU/LPA)  • Loan file review and documentation\n• Fannie Mae / Freddie Mac guideline awareness\n• Credit and income analysis  • Attention to detail  • Written communication"),
        ("4. Professional Experience",
         "List roles in reverse-chronological order. For each role, include job title, company, dates, and 3-5 bullet points of responsibilities and achievements. If you don't have mortgage experience yet, include any relevant analytical, administrative, or customer-facing roles.",
         "Sample:\n\nFinancial Operations Analyst\nABC Services Pvt Ltd, Bengaluru  ·  Jan 2023 – Present\n• Process and review 40+ financial documents per week with 99% accuracy\n• Analyse financial data to identify discrepancies and recommend corrections\n• Communicate with stakeholders to resolve documentation queries\n• Maintain compliance with internal policies and regulatory standards\n\n(If no work experience, include internships, projects, or relevant coursework.)"),
        ("5. Education",
         "List your highest qualification first. Include degree, institution, year, and any relevant coursework or projects.",
         "Sample:\n\nBachelor of Commerce (B.Com)\nBangalore University, Bengaluru  ·  2020 – 2023\n• Relevant coursework: Financial Accounting, Business Statistics, Economics\n• Final-year project: Analysis of lending risk in retail banking"),
        ("6. Certifications & Training",
         "List any relevant training, certifications, or courses — including VertexIT training.",
         "Sample:\n\nUS Mortgage Underwriting Program — VertexIT, Bengaluru  ·  2024\n• 20-module curriculum covering loan lifecycle, credit/income/asset analysis, DTI/LTV, AUS\n• Case-study based practice on real-world loan file scenarios\n• Mock interview preparation for underwriting roles"),
        ("7. Optional: Projects / Achievements",
         "If you are a fresher, include relevant academic projects, certifications, or achievements that demonstrate analytical ability or attention to detail.",
         "Sample:\n\nAcademic Project: Mortgage Risk Assessment Model\n• Built a scoring model to evaluate borrower risk based on DTI, LTV, and credit history\n• Presented findings to faculty panel and received highest grade"),
    ]
    for title, desc, sample in sections:
        story.append(Paragraph(f'<b>{title}</b>', style_h3))
        story.append(Paragraph(desc, style_body))
        story.append(Paragraph(f'<font face="Courier" size="9" color="#475569">{sample.replace(chr(10), "<br/>")}</font>',
                               ParagraphStyle("sample", fontName="Courier", fontSize=9, leading=13, textColor=SLATE, leftIndent=12, backColor=BG_LIGHT, borderPadding=8)))
        story.append(Spacer(1, 4 * mm))

    story.append(PageBreak())
    story.append(section_heading("ATS optimisation tips"))
    story.append(make_bullets([
        "Use a standard font (Arial, Calibri, or Helvetica) at 10-12pt",
        "Use standard section headings (Experience, Education, Skills) — not creative names",
        "Avoid tables, text boxes, columns, and graphics",
        "Save and submit as PDF (preserves formatting)",
        "Include keywords from the job description naturally — but don't keyword-stuff",
        "Keep it to 1 page for entry-level roles, 2 pages maximum for experienced roles",
        "Use bullet points for responsibilities, starting with action verbs",
        "Quantify achievements where possible ('Processed 40+ files per week')",
    ]))

    story.append(Spacer(1, 6 * mm))
    story.append(section_heading("Common mistakes to avoid"))
    story.append(make_bullets([
        "Don't include a photo — ATS may not parse it and it can introduce bias",
        "Don't use fancy formatting — keep it clean and simple",
        "Don't list every job you've ever had — focus on relevant roles",
        "Don't use 'I' or 'my' — bullet points should start with action verbs",
        "Don't include unrelated personal details (age, marital status, religion)",
        "Don't have typos — proofread multiple times and ask someone to review",
    ]))

    story.append(Spacer(1, 8 * mm))
    story.append(info_box("Need help?", "VertexIT's placement assistance includes resume review and personalised feedback. Speak with a counsellor after your training to get your resume reviewed before you start applying. Visit vertexit.in or WhatsApp +91 97036 86514.", bg=HexColor("#ECFEF7")))

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print("✓ Generated: mortgage-operations-resume-template.pdf")


def guide_au_glossary():
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, "australia-mortgage-glossary.pdf"),
        pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=18 * mm, bottomMargin=20 * mm,
        title="Australia Mortgage Operations Glossary — VertexIT",
        author="VertexIT", subject="Key Terms in Australian Mortgage Operations", creator="VertexIT",
    )
    story = []
    story += cover_page(
        "Australia Mortgage<br/>Operations Glossary",
        "50+ key terms and acronyms",
        "A quick-reference glossary of key terms and acronyms used in Australian mortgage operations. From LMI to LVR, broker support terminology, and lending operations concepts — perfect for candidates entering Australian mortgage roles.",
    )

    story.append(section_heading("How to use this glossary"))
    story.append(Paragraph("This glossary covers the most common terms you will encounter in Australian mortgage operations roles. Terms are grouped by category for easier reference. Use this alongside your training and as a desk reference when you start working.", style_body))
    story.append(info_box("Important note", "Australian mortgage terminology differs from US mortgage terminology in several ways. This glossary focuses on Australian terms. If you are also training in US mortgage underwriting, be aware of the differences.", bg=HexColor("#FEF3C7"), border=HexColor("#F59E0B")))
    story.append(Spacer(1, 6 * mm))

    glossary = [
        ("A", [
            ("APRA", "Australian Prudential Regulation Authority — regulates banks and lenders"),
            ("Application fee", "One-time fee charged by lenders when processing a loan application"),
            ("Approval in Principle (AIP)", "Conditional loan approval based on initial assessment, before full documentation review"),
        ]),
        ("B", [
            ("Borrower", "The person or entity taking out the loan"),
            ("Broker", "An intermediary who helps borrowers find and apply for loans from various lenders"),
            ("Broker Support", "Operational role supporting mortgage brokers — pipeline management, submissions, follow-ups"),
            ("BSB", "Bank-State-Branch — a 6-digit code identifying Australian bank branches"),
        ]),
        ("C", [
            ("Comparison rate", "Interest rate including fees and charges, for easier loan comparison"),
            ("Conditional approval", "Loan approval subject to certain conditions being met"),
            ("Conveyancing", "Legal process of transferring property ownership"),
            ("Credit assessment", "Evaluation of a borrower's creditworthiness and ability to repay"),
        ]),
        ("D", [
            ("DTI (Debt-to-Income)", "Ratio of total debt to gross income — a key affordability metric"),
            ("Discharge", "The process of paying off and releasing a mortgage"),
            ("Drawdown", "When loan funds are released to the borrower"),
        ]),
        ("E", [
            ("Equity", "The portion of the property value owned by the borrower (value minus loan)"),
            ("Exit fee", "Fee for paying off or refinancing a loan early (less common now)"),
        ]),
        ("F", [
            ("Fixed rate", "Interest rate that stays the same for a set period"),
            ("Full documentation loan", "Loan requiring full income and asset documentation (vs low-doc)"),
        ]),
        ("H", [
            ("HECS/HELP", "Higher Education Loan Program — student debt that affects borrowing capacity"),
            ("Honeymoon rate", "Introductory low interest rate, usually reverting to a higher rate after a period"),
        ]),
        ("I", [
            ("Interest-only loan", "Loan where only interest is paid for a set period, then principal + interest"),
            ("IO", "Abbreviation for Interest-Only"),
        ]),
        ("L", [
            ("Lender", "The financial institution providing the loan"),
            ("LMI (Lenders Mortgage Insurance)", "Insurance protecting the lender if the borrower defaults — required for high-LVR loans"),
            ("Loan administration", "Post-settlement management of a loan — disbursements, statements, compliance"),
            ("Loan submission", "The process of submitting a loan application to a lender for assessment"),
            ("Low-doc loan", "Loan requiring less income documentation (for self-employed borrowers)"),
            ("LVR (Loan-to-Value Ratio)", "Loan amount divided by property value, expressed as a percentage — key risk metric"),
        ]),
        ("M", [
            ("Mortgage", "A loan secured by property"),
            ("Mortgage Broker Virtual Assistant", "Remote operational support role for mortgage brokers"),
        ]),
        ("N", [
            ("Negative gearing", "When rental income is less than loan expenses — common investment strategy in Australia"),
            ("NAF (Net Advance to Finance)", "The net loan amount after fees and charges"),
        ]),
        ("O", [
            ("Offset account", "Transaction account linked to a loan — balance reduces the interest charged"),
            ("Originator", "Person or entity that originates (creates) a loan"),
        ]),
        ("P", [
            ("P&I (Principal & Interest)", "Loan repayment type where both principal and interest are paid"),
            ("Pre-approval", "Conditional loan approval before finding a property"),
            ("Processing", "The workflow of collecting, verifying, and preparing loan documentation"),
            ("Property settlement", "The completion of a property transaction — funds and title are exchanged"),
        ]),
        ("R", [
            ("Refinancing", "Replacing an existing loan with a new one (same or different lender)"),
            ("Repayment", "The regular payment made by the borrower toward the loan"),
        ]),
        ("S", [
            ("Security", "The property used as collateral for the loan"),
            ("Serviceability", "A borrower's ability to meet loan repayments — assessed via income, expenses, and debts"),
            ("Settlement", "The completion of a property transaction"),
            ("Split loan", "A loan split into portions with different rates (e.g., part fixed, part variable)"),
        ]),
        ("U", [
            ("Unconditional approval", "Final loan approval with all conditions met"),
            ("Underwriting", "Assessment of loan risk and decision to approve or decline"),
        ]),
        ("V", [
            ("Valuation", "Independent assessment of property value — ordered by the lender"),
            ("Variable rate", "Interest rate that can change with market conditions"),
            ("Verification", "Confirming the accuracy of borrower information and documentation"),
        ]),
    ]

    for letter, terms in glossary:
        story.append(Paragraph(f'<b>{letter}</b>', style_h2))
        term_data = [["Term", "Definition"]] + [[term, definition] for term, definition in terms]
        t = Table(term_data, colWidths=[55 * mm, 115 * mm])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), NAVY),
            ("TEXTCOLOR", (0, 0), (-1, 0), white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, BG_LIGHT]),
        ]))
        story.append(t)
        story.append(Spacer(1, 4 * mm))

    story.append(Spacer(1, 6 * mm))
    story.append(info_box("Disclaimer", "This glossary is for educational purposes. Australian lending regulations and terminology may change. Always refer to current lender guidelines and ASIC regulations. VertexIT's Australia Mortgage program covers these terms in depth with practical scenarios."))

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print("✓ Generated: australia-mortgage-glossary.pdf")


def guide_interview_checklist():
    doc = SimpleDocTemplate(
        os.path.join(OUTPUT_DIR, "mortgage-interview-preparation-checklist.pdf"),
        pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=18 * mm, bottomMargin=20 * mm,
        title="Mortgage Interview Preparation Checklist — VertexIT",
        author="VertexIT", subject="Step-by-Step Interview Preparation Checklist", creator="VertexIT",
    )
    story = []
    story += cover_page(
        "Mortgage Interview<br/>Preparation Checklist",
        "Step-by-step preparation guide",
        "A structured checklist to prepare for mortgage operations and underwriting interviews — from company research to mock interviews to follow-up. Use this alongside the Interview Questions guide for the best results.",
    )

    story.append(section_heading("How to use this checklist"))
    story.append(Paragraph("This checklist breaks interview preparation into 5 phases. Work through each phase in order. Each phase has checkable items — tick them off as you complete them. Aim to complete all phases at least 2 days before your interview.", style_body))
    story.append(Spacer(1, 4 * mm))

    phases = [
        ("Phase 1: Research (7 days before)", [
            "Research the company — what they do, their market position, and recent news",
            "Understand the role — read the job description carefully and identify key requirements",
            "Research the interviewer (if known) — their background and role at the company",
            "Understand the loan products the company handles (conventional, FHA, non-conforming)",
            "Check if they use specific systems (DU, LPA, specific LOS) and review the basics",
            "Note down 3-5 things that interest you about the company",
        ]),
        ("Phase 2: Knowledge refresh (5 days before)", [
            "Review mortgage fundamentals — loan lifecycle, DTI, LTV, CLTV, AUS concepts",
            "Review key documents — 1003, credit report, W-2/paystubs, tax returns, appraisal",
            "Review underwriting decisions — approve, suspend, deny, conditions",
            "Review income types — W-2, self-employed, rental",
            "Practice calculating DTI and LTV on sample scenarios",
            "Review common red flags — large deposits, employment gaps, inconsistent info",
        ]),
        ("Phase 3: Practice (3 days before)", [
            "Practice answering 10-15 common interview questions out loud",
            "Prepare 3-5 scenario-based answers using the STAR method",
            "Prepare answers for behavioural questions (caught an error, disagreed with a colleague, handled pressure)",
            "Prepare 4-5 questions to ask the interviewer",
            "Do a mock interview with a friend, mentor, or VertexIT counsellor",
            "Record yourself answering questions and review for clarity and confidence",
        ]),
        ("Phase 4: Logistics (1 day before)", [
            "Confirm interview time, location (or video link), and format",
            "Prepare your outfit — business professional, clean and wrinkle-free",
            "Print 2 copies of your resume (for in-person interviews)",
            "Prepare a notepad and pen for taking notes",
            "Test your tech (for video interviews) — camera, mic, internet, platform",
            "Plan your travel route (for in-person interviews) — aim to arrive 10 minutes early",
            "Get a good night's sleep",
        ]),
        ("Phase 5: Interview day", [
            "Arrive 10 minutes early (in-person) or log in 5 minutes early (video)",
            "Greet everyone politely — receptionist, interviewer, anyone you meet",
            "Listen carefully to questions — it's okay to pause and think before answering",
            "Use the STAR method for behavioural and scenario questions",
            "Ask your prepared questions at the end",
            "Thank the interviewer for their time",
            "Send a thank-you email within 24 hours referencing something specific from the interview",
        ]),
    ]

    for phase_title, items in phases:
        story.append(Paragraph(f'<b>{phase_title}</b>', style_h2))
        # Create checklist with checkboxes
        check_items = []
        for item in items:
            check_items.append([Paragraph("☐", ParagraphStyle("box", fontSize=12, textColor=TEAL, alignment=TA_LEFT)),
                                 Paragraph(item, ParagraphStyle("item", fontName="Helvetica", fontSize=10, leading=14, textColor=HexColor("#1E293B")))])
        check_table = Table(check_items, colWidths=[10 * mm, 160 * mm])
        check_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
            ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(check_table)
        story.append(Spacer(1, 6 * mm))

    story.append(PageBreak())
    story.append(section_heading("Common interview mistakes to avoid"))
    story.append(make_bullets([
        "Don't arrive late — plan for traffic or tech issues",
        "Don't speak negatively about previous employers or colleagues",
        "Don't guess if you don't know an answer — say 'I'm not sure, but here's how I would find out'",
        "Don't ask about salary or benefits in the first interview (unless the interviewer brings it up)",
        "Don't forget to ask questions — it shows disinterest",
        "Don't use filler words ('um', 'like') — pause instead",
        "Don't interrupt the interviewer — listen fully before responding",
    ]))

    story.append(Spacer(1, 6 * mm))
    story.append(section_heading("Post-interview follow-up"))
    story.append(Paragraph("Within 24 hours of your interview, send a thank-you email to the interviewer (if you have their contact) or to the recruiter. Keep it brief — thank them for their time, reference something specific you discussed, and reiterate your interest in the role.", style_body))
    story.append(Paragraph("Sample follow-up email:", style_h3))
    story.append(Paragraph(
        '<font face="Courier" size="9" color="#475569">Subject: Thank you — Interview for [Role Name]<br/><br/>Dear [Interviewer Name],<br/><br/>'
        'Thank you for taking the time to speak with me yesterday about the [Role Name] position. I really enjoyed learning more about your team and the work you do with [specific topic discussed].<br/><br/>'
        'I am very interested in the opportunity and would welcome the chance to contribute to [Company Name]. Please let me know if you need any additional information from me.<br/><br/>'
        'Best regards,<br/>[Your Name]</font>',
        ParagraphStyle("email", fontName="Courier", fontSize=9, leading=13, textColor=SLATE, leftIndent=12, backColor=BG_LIGHT, borderPadding=8)
    ))

    story.append(Spacer(1, 8 * mm))
    story.append(info_box("Ready to practice?", "VertexIT's placement assistance includes mock interviews with feedback. Speak with a counsellor to schedule a mock interview before your real one. Visit vertexit.in or WhatsApp +91 97036 86514.", bg=HexColor("#ECFEF7")))

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print("✓ Generated: mortgage-interview-preparation-checklist.pdf")


if __name__ == "__main__":
    print("Generating VertexIT resource PDFs...")
    guide_interview_questions()
    guide_career_pathways()
    guide_fundamentals_cheatsheet()
    guide_resume_template()
    guide_au_glossary()
    guide_interview_checklist()
    print(f"\nAll guides saved to: {OUTPUT_DIR}")
