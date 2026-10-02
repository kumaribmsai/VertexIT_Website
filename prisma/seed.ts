import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding VertexIT database...");

  // 1. Site Settings (singleton)
  await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      brandName: "VertexIT",
      tagline: "LEARN • APPLY",
      phone: "9703686514",
      whatsapp: "9703686514",
      addressLine: "GB Play",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      businessHours: "10:00 AM - 8:00 PM",
      logoUrl: "/vertexit-logo.jpeg",
      faviconUrl: "/vertexit-logo.jpeg",
      heroEyebrow: "CAREER-FOCUSED MORTGAGE TRAINING",
      heroHeading: "Build Skills. Become Job-Ready. Build Your Mortgage Career.",
      heroSubheading:
        "Industry-focused training in US Mortgage Underwriting and Australian Mortgage Operations, designed for graduates, experienced professionals and career switchers.",
      heroPrimaryCta: "WhatsApp Us",
      heroSecondaryCta: "Explore Courses",
      finalCtaHeading: "Ready to build your mortgage career?",
      finalCtaSubheading:
        "Speak with a VertexIT counsellor today and find the right path for your goals.",
    },
  });
  console.log("✓ Site settings");

  // 2. Default admin user (super admin)
  const existingAdmin = await db.adminUser.findUnique({ where: { email: "admin@vertexit.in" } });
  if (!existingAdmin) {
    await db.adminUser.create({
      data: {
        email: "admin@vertexit.in",
        name: "VertexIT Admin",
        passwordHash: hashPassword("vertexit123"),
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });
    console.log("✓ Default admin user (admin@vertexit.in / vertexit123)");
  } else {
    console.log("✓ Admin user already exists");
  }

  // 3. Courses — US Mortgage Underwriting
  const usCourse = await db.course.upsert({
    where: { slug: "us-mortgage-underwriting" },
    update: {},
    create: {
      title: "US Mortgage – Underwriting",
      slug: "us-mortgage-underwriting",
      shortDescription:
        "Job-oriented training in US Mortgage Underwriting covering loan lifecycle, credit, income, asset analysis, LTV, AUS and real-world case studies.",
      introduction:
        "The US Mortgage Underwriting program at VertexIT is built for candidates who want to enter the US mortgage and lending operations industry. The curriculum is structured around the real underwriting workflow — from understanding loan types and mortgage lifecycle to credit, income and asset analysis, debt-to-income ratios, LTV/CLTV concepts, automated underwriting and case-study based practice. The training is practical and job-focused, designed to help you build the skills hiring teams look for.",
      whoFor:
        "Graduates, experienced professionals and career switchers who want to enter US mortgage underwriting, mortgage processing or mortgage operations roles.",
      whatYouLearn:
        "You will learn how the US mortgage industry operates, how to read and analyse loan files, how credit, income and assets are assessed, how DTI, LTV and CLTV ratios work, how automated underwriting systems operate, and how underwriting decisions are made in practice.",
      practicalLearning:
        "Hands-on file practice, document review, ratio calculation, and case-study based underwriting scenarios.",
      caseStudies:
        "Real-world style file practice including W-2 and self-employed borrower analysis, document review and decision scenarios.",
      careerRoles:
        "Mortgage Underwriting roles, Mortgage Operations roles, Mortgage Processing roles, Credit / Lending support roles, Related mortgage operations roles.",
      placementAssistance:
        "Placement assistance with resume guidance, interview preparation and access to relevant opportunities, supported throughout your job-search journey.",
      trainingMode: "HYBRID",
      eligibility: "Any graduate. Previous mortgage experience is not mandatory.",
      keySkills:
        "Loan file analysis\nCredit analysis\nIncome analysis (W-2 & self-employed)\nAsset review\nDTI, LTV, CLTV calculation\nAUS concepts\nFannie Mae / Freddie Mac guideline awareness",
      careerPathways:
        "Mortgage Underwriter\nMortgage Processor\nMortgage Operations Analyst\nCredit / Lending Support\nUnderwriting Assistant",
      duration: null, // "To be confirmed" until CMS provides it
      courseFee: null, // never shown publicly at launch
      status: "ACTIVE",
      featuredImage: "/uploads/courses/us-mortgage.jpg",
      metaTitle: "US Mortgage Underwriting Training | VertexIT",
      metaDescription:
        "Practical US Mortgage Underwriting training in Bengaluru covering credit, income, asset analysis, DTI, LTV and AUS. Built for graduates and career switchers.",
      isPublished: true,
      isDemo: false,
      displayOrder: 1,
      modules: {
        create: [
          { title: "Introduction to the US Mortgage Industry", sortOrder: 1, description: "Overview of the US mortgage market, key players and terminology." },
          { title: "Mortgage Lifecycle", sortOrder: 2, description: "End-to-end journey of a mortgage loan." },
          { title: "Loan Types and Mortgage Fundamentals", sortOrder: 3, description: "Conventional, FHA, VA and other loan products." },
          { title: "Loan Application and Documentation", sortOrder: 4, description: "1003, disclosures and supporting documents." },
          { title: "Credit Analysis", sortOrder: 5, description: "Credit reports, scores and tradeline review." },
          { title: "Income Analysis", sortOrder: 6, description: "W-2, self-employed and rental income." },
          { title: "Asset Analysis", sortOrder: 7, description: "Bank statements, large deposits and asset sourcing." },
          { title: "Debt-to-Income and Related Ratios", sortOrder: 8, description: "DTI, housing ratio and qualification." },
          { title: "LTV / CLTV / HCLTV Concepts", sortOrder: 9, description: "Loan-to-value and combined loan-to-value." },
          { title: "Property and Collateral Review", sortOrder: 10, description: "Appraisals, title and property types." },
          { title: "Underwriting Decision Process", sortOrder: 11, description: "Approve, suspend, deny and conditions." },
          { title: "Conditions and Documentation Review", sortOrder: 12, description: "Prior-to-doc and prior-to-funding conditions." },
          { title: "Automated Underwriting Concepts", sortOrder: 13, description: "DU / LP findings interpretation." },
          { title: "Fannie Mae / Freddie Mac Guideline Awareness", sortOrder: 14, description: "Selling-guide awareness for underwriters." },
          { title: "FHA / VA Concepts Where Applicable", sortOrder: 15, description: "Government loan basics." },
          { title: "Self-Employed Borrower Analysis", sortOrder: 16, description: "Personal and business returns analysis." },
          { title: "Fraud and Risk Awareness", sortOrder: 17, description: "Red flags and fraud prevention basics." },
          { title: "Case-Study-Based Underwriting", sortOrder: 18, description: "Practical decision scenarios." },
          { title: "Real-World File Practice", sortOrder: 19, description: "Hands-on practice files." },
          { title: "Interview Preparation", sortOrder: 20, description: "Mock interviews and role-specific questions." },
        ],
      },
    },
  });

  // Outcomes for US course
  if ((await db.courseOutcome.count({ where: { courseId: usCourse.id } })) === 0) {
    await db.courseOutcome.createMany({
      data: [
        { courseId: usCourse.id, text: "Read and interpret US mortgage loan files", sortOrder: 1 },
        { courseId: usCourse.id, text: "Calculate DTI, LTV, CLTV and qualifying ratios", sortOrder: 2 },
        { courseId: usCourse.id, text: "Analyse credit reports and tradelines", sortOrder: 3 },
        { courseId: usCourse.id, text: "Assess W-2 and self-employed borrower income", sortOrder: 4 },
        { courseId: usCourse.id, text: "Understand AUS (DU / LP) outputs", sortOrder: 5 },
        { courseId: usCourse.id, text: "Apply underwriting conditions in realistic scenarios", sortOrder: 6 },
      ],
    });
  }

  // Course FAQs for US course
  if ((await db.courseFaq.count({ where: { courseId: usCourse.id } })) === 0) {
    await db.courseFaq.createMany({
      data: [
        { courseId: usCourse.id, question: "Do I need previous mortgage experience to join?", answer: "No. The US Mortgage Underwriting program is designed for graduates and career switchers. Previous mortgage experience is not mandatory.", sortOrder: 1 },
        { courseId: usCourse.id, question: "Is the training online or offline?", answer: "The training is hybrid — combining live online sessions with in-person practice where applicable. Please speak with a VertexIT counsellor for current batch details.", sortOrder: 2 },
        { courseId: usCourse.id, question: "Will I become a licensed underwriter after this course?", answer: "This course builds job-ready underwriting skills and knowledge. It does not automatically confer any regulatory licence. Please speak with a counsellor for current eligibility details.", sortOrder: 3 },
        { courseId: usCourse.id, question: "Are course fees displayed publicly?", answer: "Course fees are not displayed publicly at launch. Please speak with a VertexIT counsellor for fee and batch information.", sortOrder: 4 },
        { courseId: usCourse.id, question: "How does placement assistance work?", answer: "VertexIT provides placement assistance with resume guidance, interview preparation and relevant opportunities. Actual hiring depends on employer requirements and candidate suitability.", sortOrder: 5 },
      ],
    });
  }
  console.log("✓ US Mortgage course + modules + outcomes + FAQs");

  // 4. Courses — Australia Mortgage
  const ausCourse = await db.course.upsert({
    where: { slug: "australia-mortgage" },
    update: {},
    create: {
      title: "Australia Mortgage",
      slug: "australia-mortgage",
      shortDescription:
        "Practical training in Australian Mortgage Operations covering loan processing, broker support, loan administration, credit assessment and lending operations.",
      introduction:
        "The Australia Mortgage program at VertexIT prepares candidates for mortgage and lending operations roles in the Australian market. The curriculum covers the Australian home loan lifecycle, loan application processing, document collection and verification, borrower assessment, income and living-expense review, credit assessment, property and security documentation, loan administration, broker support and post-submission follow-up. The training is practical and designed around the real workflows used in Australian lending operations.",
      whoFor:
        "Graduates, experienced professionals and career switchers interested in Australian mortgage processing, broker support, loan administration and lending operations roles.",
      whatYouLearn:
        "You will learn the Australian mortgage industry, the home loan lifecycle, how to process loan applications, collect and verify documents, assess borrowers, review income and living expenses, support brokers, manage loan administration and handle post-submission follow-up.",
      practicalLearning:
        "Case studies and practical scenarios covering the full Australian loan lifecycle.",
      caseStudies:
        "Practical scenarios including document collection, broker communication and settlement administration concepts.",
      careerRoles:
        "Mortgage Loan Processing, Broker Support, Loan Administration, Credit Assessment support, Lending Operations, Mortgage Broker Virtual Assistant, Related lending operations roles.",
      placementAssistance:
        "Placement assistance with resume guidance, interview preparation and access to relevant opportunities.",
      trainingMode: "HYBRID",
      eligibility: "Any graduate. Previous mortgage experience is not mandatory.",
      keySkills:
        "Loan application processing\nDocument collection & verification\nBorrower assessment\nIncome & living expense review\nCredit assessment\nLoan administration\nBroker communication\nPost-submission follow-up",
      careerPathways:
        "Mortgage Loan Processor\nBroker Support Associate\nLoan Administration Analyst\nLending Operations Analyst\nMortgage Broker Virtual Assistant",
      duration: null,
      courseFee: null,
      status: "ACTIVE",
      featuredImage: "/uploads/courses/australia-mortgage.jpg",
      metaTitle: "Australia Mortgage Training | VertexIT",
      metaDescription:
        "Australia Mortgage operations training in Bengaluru covering loan processing, broker support, credit assessment and lending operations. Practical, job-focused curriculum.",
      isPublished: true,
      isDemo: false,
      displayOrder: 2,
      modules: {
        create: [
          { title: "Australian Mortgage Industry Overview", sortOrder: 1, description: "Structure of the Australian mortgage market." },
          { title: "Australian Home Loan Lifecycle", sortOrder: 2, description: "End-to-end lifecycle of an Australian home loan." },
          { title: "Loan Application Processing", sortOrder: 3, description: "Application intake, data entry and validation." },
          { title: "Document Collection and Verification", sortOrder: 4, description: "Identity, income and asset documentation." },
          { title: "Borrower and Applicant Assessment", sortOrder: 5, description: "Applicant profile and suitability." },
          { title: "Income Assessment", sortOrder: 6, description: "PAYG, self-employed and rental income." },
          { title: "Living Expense / Liability Review", sortOrder: 7, description: "HES, liabilities and expense verification." },
          { title: "Credit Assessment", sortOrder: 8, description: "Credit reports and credit risk basics." },
          { title: "Property / Security Documentation", sortOrder: 9, description: "Property and security review." },
          { title: "Loan Administration", sortOrder: 10, description: "Post-settlement administration." },
          { title: "Broker Support", sortOrder: 11, description: "Supporting mortgage brokers day-to-day." },
          { title: "Lender and Broker Communication", sortOrder: 12, description: "Effective written and verbal communication." },
          { title: "Loan Submission Support", sortOrder: 13, description: "Submission packaging and follow-up." },
          { title: "Post-submission Follow-up", sortOrder: 14, description: "Condition tracking and updates." },
          { title: "Settlement / Administration Concepts", sortOrder: 15, description: "Settlement workflow basics." },
          { title: "Lending Operations", sortOrder: 16, description: "Lending operations processes." },
          { title: "Mortgage Broker Virtual Assistant Responsibilities", sortOrder: 17, description: "Broker VA scope and responsibilities." },
          { title: "Case Studies and Practical Scenarios", sortOrder: 18, description: "Hands-on Australian mortgage scenarios." },
          { title: "Interview Preparation", sortOrder: 19, description: "Role-specific interview preparation." },
        ],
      },
    },
  });

  if ((await db.courseOutcome.count({ where: { courseId: ausCourse.id } })) === 0) {
    await db.courseOutcome.createMany({
      data: [
        { courseId: ausCourse.id, text: "Process Australian loan applications end-to-end", sortOrder: 1 },
        { courseId: ausCourse.id, text: "Collect and verify borrower documentation", sortOrder: 2 },
        { courseId: ausCourse.id, text: "Assess income, living expenses and liabilities", sortOrder: 3 },
        { courseId: ausCourse.id, text: "Support brokers and lenders effectively", sortOrder: 4 },
        { courseId: ausCourse.id, text: "Handle loan administration and post-submission follow-up", sortOrder: 5 },
        { courseId: ausCourse.id, text: "Communicate professionally in Australian lending context", sortOrder: 6 },
      ],
    });
  }

  if ((await db.courseFaq.count({ where: { courseId: ausCourse.id } })) === 0) {
    await db.courseFaq.createMany({
      data: [
        { courseId: ausCourse.id, question: "Will I become a licensed Australian mortgage broker after this course?", answer: "No. This training prepares candidates for mortgage and lending support and operations roles. It does not automatically grant broker licensing.", sortOrder: 1 },
        { courseId: ausCourse.id, question: "Is the training online or offline?", answer: "The training is hybrid. Please speak with a VertexIT counsellor for current batch details.", sortOrder: 2 },
        { courseId: ausCourse.id, question: "Do I need previous mortgage experience?", answer: "No previous mortgage experience is required. The program is designed for graduates and career switchers.", sortOrder: 3 },
        { courseId: ausCourse.id, question: "What roles does this prepare me for?", answer: "The training prepares candidates for mortgage loan processing, broker support, loan administration, credit assessment support and lending operations roles.", sortOrder: 4 },
      ],
    });
  }
  console.log("✓ Australia Mortgage course + modules + outcomes + FAQs");

  // 5. Global FAQs
  const faqSeed: { question: string; answer: string; category: string; sortOrder: number }[] = [
    { question: "Who can join VertexIT?", answer: "Any graduate, experienced professional or career switcher interested in mortgage and lending operations can join VertexIT. Please speak with a counsellor for current eligibility details.", category: "General", sortOrder: 1 },
    { question: "Are fresh graduates eligible?", answer: "Yes. Fresh graduates are eligible to apply. Our programs are designed to build practical, job-ready skills from the ground up.", category: "Eligibility", sortOrder: 2 },
    { question: "Is the training online or offline?", answer: "VertexIT offers hybrid training — combining live online sessions with in-person practice where applicable. Please speak with a counsellor for current batch details.", category: "Training", sortOrder: 3 },
    { question: "What is hybrid training?", answer: "Hybrid training combines the flexibility of online learning with the depth of in-person, practical sessions — designed to accommodate working professionals and outstation candidates.", category: "Training", sortOrder: 4 },
    { question: "What does the US Mortgage course cover?", answer: "The US Mortgage Underwriting program covers the US mortgage industry, loan types, loan application and documentation, credit, income and asset analysis, DTI, LTV/CLTV, AUS concepts, Fannie Mae / Freddie Mac guideline awareness, case studies and interview preparation.", category: "Courses", sortOrder: 5 },
    { question: "What does the Australia Mortgage course cover?", answer: "The Australia Mortgage program covers the Australian mortgage industry, home loan lifecycle, loan application processing, document collection and verification, borrower assessment, income and living expense review, credit assessment, loan administration, broker support and interview preparation.", category: "Courses", sortOrder: 6 },
    { question: "Do I need previous mortgage experience?", answer: "No. Previous mortgage experience is not mandatory for either launch course. The curriculum is designed to build the required skills.", category: "Eligibility", sortOrder: 7 },
    { question: "How does placement assistance work?", answer: "VertexIT provides placement assistance with a very high placement rate. This includes resume guidance, interview preparation and relevant opportunities. Actual hiring depends on employer requirements and candidate suitability.", category: "Placement", sortOrder: 8 },
    { question: "Do you provide interview preparation?", answer: "Yes. Interview preparation is built into the curriculum, including mock interviews and role-specific question practice.", category: "Placement", sortOrder: 9 },
    { question: "Are course fees displayed?", answer: "Course fees are not displayed publicly at launch. Please speak with a VertexIT counsellor for fee and batch information.", category: "Fees", sortOrder: 10 },
    { question: "How can I contact a counsellor?", answer: "You can reach a VertexIT counsellor on WhatsApp at +91 97036 86514 or through the contact form on this website.", category: "Contact", sortOrder: 11 },
    { question: "Where is VertexIT located?", answer: "VertexIT is located in Bengaluru, Karnataka, India. Please speak with our team for the current office location and visiting hours.", category: "Contact", sortOrder: 12 },
  ];
  for (const f of faqSeed) {
    const existing = await db.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await db.faq.create({ data: { ...f, isPublished: true } });
    }
  }
  console.log(`✓ ${faqSeed.length} FAQs`);

  // 6. Blog Categories
  const categories = [
    "US Mortgage", "Mortgage Underwriting", "Australia Mortgage", "Mortgage Careers",
    "Career Advice", "Interview Preparation", "Resume & LinkedIn", "Mortgage Operations",
    "Industry Knowledge", "Job Search",
  ];
  const catMap: Record<string, string> = {};
  for (let i = 0; i < categories.length; i++) {
    const name = categories[i];
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const cat = await db.blogCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug, sortOrder: i + 1 },
    });
    catMap[name] = cat.id;
  }
  console.log(`✓ ${categories.length} blog categories`);

  // 7. Blog drafts (drafts — not published)
  const blogDrafts: { title: string; slug: string; excerpt: string; content: string; categoryName: string; tags?: string }[] = [
    {
      title: "US Mortgage Underwriting: A Beginner's Career Guide",
      slug: "us-mortgage-underwriting-beginner-career-guide",
      excerpt: "A practical introduction to starting a career in US mortgage underwriting — what the role involves, the skills you need, and how to get started.",
      content: "# US Mortgage Underwriting: A Beginner's Career Guide\n\nUS mortgage underwriting is one of the most in-demand career paths in the global mortgage and lending operations industry. In this guide, we walk through what the role involves, the core skills you need to build, and how to get started.\n\n## What does a mortgage underwriter do?\n\nA mortgage underwriter assesses whether a borrower meets the lender's guidelines for a home loan. This involves reviewing credit, income, assets, debts and the property itself before approving, suspending or denying the loan.\n\n## Skills you need\n\n- Loan file analysis\n- Credit report interpretation\n- Income analysis (W-2 and self-employed)\n- DTI, LTV and CLTV calculations\n- AUS (DU/LP) concepts\n\n## How to start\n\nThe most effective way to start is structured, practical training combined with case-study based practice. VertexIT's US Mortgage Underwriting program is designed to build exactly these skills.\n\n_Speak with a VertexIT counsellor to learn more._",
      categoryName: "Mortgage Underwriting",
      tags: "us mortgage, underwriting, careers",
    },
    {
      title: "What Does a Mortgage Underwriter Do?",
      slug: "what-does-a-mortgage-underwriter-do",
      excerpt: "Understand the day-to-day responsibilities of a mortgage underwriter and the decision-making process behind loan approvals.",
      content: "# What Does a Mortgage Underwriter Do?\n\nA mortgage underwriter evaluates the risk of lending to a borrower. Their job is to verify that the borrower, the property and the loan structure meet the lender's guidelines.\n\n## The underwriting decision\n\nAn underwriter typically decides between:\n- **Approve** — loan meets guidelines\n- **Suspend** — more information required\n- **Deny** — loan does not meet guidelines\n\n## Day-to-day tasks\n\n- Reviewing loan files\n- Verifying income, assets and credit\n- Calculating DTI, LTV and CLTV\n- Issuing conditions\n- Communicating with processors and loan officers",
      categoryName: "Mortgage Underwriting",
    },
    {
      title: "US Mortgage Underwriting Skills You Need to Build",
      slug: "us-mortgage-underwriting-skills-to-build",
      excerpt: "The core technical and analytical skills that hiring teams look for in entry-level US mortgage underwriting roles.",
      content: "# US Mortgage Underwriting Skills You Need to Build\n\nBreaking into US mortgage underwriting requires a mix of technical knowledge and analytical skill. Here are the most important skills to build.\n\n## Technical skills\n\n- Mortgage lifecycle understanding\n- Loan types (conventional, FHA, VA)\n- Credit analysis\n- Income analysis (W-2 and self-employed)\n- DTI, LTV, CLTV ratios\n- AUS interpretation (DU / LP)\n\n## Analytical skills\n\n- Attention to detail\n- Reading documentation carefully\n- Spotting red flags\n\n_Building these skills through practical case studies is the fastest path to becoming job-ready._",
      categoryName: "Mortgage Underwriting",
    },
    {
      title: "How Mortgage Underwriting Works",
      slug: "how-mortgage-underwriting-works",
      excerpt: "A simple, practical walkthrough of the mortgage underwriting process from application to decision.",
      content: "# How Mortgage Underwriting Works\n\nMortgage underwriting is the process by which a lender assesses the risk of a home loan. This article walks through the key steps.\n\n## The process\n\n1. Application received\n2. Document collection\n3. Credit, income and asset analysis\n4. Property and collateral review\n5. DTI, LTV and CLTV calculation\n6. AUS submission (where applicable)\n7. Decision: approve, suspend or deny\n8. Conditions issued and cleared",
      categoryName: "Mortgage Underwriting",
    },
    {
      title: "Australia Mortgage Processing: Roles and Responsibilities",
      slug: "australia-mortgage-processing-roles-responsibilities",
      excerpt: "An overview of Australian mortgage processing roles and the day-to-day responsibilities of loan processing professionals.",
      content: "# Australia Mortgage Processing: Roles and Responsibilities\n\nAustralian mortgage processing is a key function in the home loan lifecycle. This article explains what the role involves.\n\n## Core responsibilities\n\n- Loan application intake and data entry\n- Document collection and verification\n- Borrower and applicant assessment support\n- Income and living expense review\n- Communication with brokers and lenders\n- Post-submission follow-up",
      categoryName: "Australia Mortgage",
    },
    {
      title: "What Does a Mortgage Broker Support Professional Do?",
      slug: "what-does-a-mortgage-broker-support-professional-do",
      excerpt: "Understand the broker support role in the Australian mortgage industry and the value these professionals bring to brokers and borrowers.",
      content: "# What Does a Mortgage Broker Support Professional Do?\n\nMortgage broker support professionals help brokers manage loan pipelines, communicate with lenders, and ensure files move smoothly from application to settlement.\n\n## Day-to-day tasks\n\n- Managing broker pipelines\n- Preparing loan submissions\n- Following up on conditions\n- Coordinating with lenders\n- Assisting with documentation",
      categoryName: "Australia Mortgage",
    },
    {
      title: "Mortgage Loan Processing vs Underwriting",
      slug: "mortgage-loan-processing-vs-underwriting",
      excerpt: "Understand the difference between mortgage loan processing and underwriting — two distinct but complementary roles.",
      content: "# Mortgage Loan Processing vs Underwriting\n\nProcessing and underwriting are two distinct but complementary roles in the mortgage lifecycle.\n\n## Processing\n\n- Collects and organises documentation\n- Verifies data entry\n- Prepares the file for underwriting\n\n## Underwriting\n\n- Assesses risk against guidelines\n- Makes the approve / suspend / deny decision\n- Issues conditions",
      categoryName: "Mortgage Operations",
    },
    {
      title: "Career Opportunities in Mortgage Operations",
      slug: "career-opportunities-in-mortgage-operations",
      excerpt: "Explore the range of career opportunities available in mortgage operations across US and Australian lending markets.",
      content: "# Career Opportunities in Mortgage Operations\n\nMortgage operations is a broad field with multiple entry points and growth paths.\n\n## Common roles\n\n- Mortgage Loan Processor\n- Underwriting Assistant / Underwriter\n- Loan Administration Analyst\n- Credit / Lending Support\n- Broker Support / Virtual Assistant\n- Lending Operations Analyst\n\n_Graduates and career switchers can enter this field with the right practical training._",
      categoryName: "Mortgage Careers",
    },
    {
      title: "How to Prepare for a Mortgage Interview",
      slug: "how-to-prepare-for-a-mortgage-interview",
      excerpt: "Practical tips to prepare for mortgage operations and underwriting interviews — from core concepts to common questions.",
      content: "# How to Prepare for a Mortgage Interview\n\nMortgage interviews test both conceptual knowledge and practical reasoning. Here's how to prepare effectively.\n\n## Conceptual preparation\n\n- Mortgage lifecycle\n- Loan types\n- Credit, income, asset basics\n- DTI, LTV, CLTV\n- AUS concepts\n\n## Practical preparation\n\n- Case-study based reasoning\n- Document review scenarios\n- Red flag identification\n\n## Common questions\n\n- Walk me through the mortgage lifecycle\n- How would you assess a self-employed borrower?\n- What is DTI and why does it matter?",
      categoryName: "Interview Preparation",
    },
    {
      title: "Skills Graduates Can Build for Mortgage Operations Careers",
      slug: "skills-graduates-can-build-for-mortgage-operations",
      excerpt: "A practical skill-building roadmap for graduates looking to enter mortgage operations roles.",
      content: "# Skills Graduates Can Build for Mortgage Operations Careers\n\nGraduates entering mortgage operations should focus on building a mix of technical and communication skills.\n\n## Technical\n\n- Loan file review\n- Documentation verification\n- Ratio calculations\n- AUS interpretation\n\n## Communication\n\n- Clear written English\n- Professional email etiquette\n- Lender and broker communication",
      categoryName: "Career Advice",
    },
    {
      title: "US Mortgage Careers in Bengaluru",
      slug: "us-mortgage-careers-in-bengaluru",
      excerpt: "Why Bengaluru has become a hub for US mortgage operations careers and what candidates should know.",
      content: "# US Mortgage Careers in Bengaluru\n\nBengaluru is one of India's leading hubs for global mortgage operations, with strong demand for trained underwriters, processors and operations analysts.\n\n## Why Bengaluru?\n\n- Presence of global capability centres\n- Strong BFSI hiring ecosystem\n- Hybrid and remote-friendly roles\n\n## How to start\n\nStructured practical training is the fastest way to build the skills hiring teams in Bengaluru look for.",
      categoryName: "Mortgage Careers",
    },
    {
      title: "Australia Mortgage Operations Careers in India",
      slug: "australia-mortgage-operations-careers-in-india",
      excerpt: "An overview of Australia mortgage operations careers available to candidates in India.",
      content: "# Australia Mortgage Operations Careers in India\n\nAustralia mortgage operations is a growing career segment in India, with opportunities in loan processing, broker support, loan administration and lending operations.\n\n## Common roles\n\n- Mortgage Loan Processor\n- Broker Support Associate\n- Loan Administration Analyst\n- Mortgage Broker Virtual Assistant\n\n_Building Australian mortgage knowledge through structured training is the key to entering this segment._",
      categoryName: "Mortgage Careers",
    },
    {
      title: "Mortgage Operations Resume Tips",
      slug: "mortgage-operations-resume-tips",
      excerpt: "Practical resume tips for candidates applying to mortgage operations and underwriting roles.",
      content: "# Mortgage Operations Resume Tips\n\nA strong resume is essential for standing out in mortgage operations hiring.\n\n## What to highlight\n\n- Relevant training and certifications\n- Practical case-study experience\n- Analytical and detail-oriented skills\n- Communication skills\n\n## What to avoid\n\n- Generic summaries\n- Irrelevant experience listed in detail\n- Spelling or formatting errors",
      categoryName: "Resume & LinkedIn",
    },
    {
      title: "Common Mortgage Interview Questions",
      slug: "common-mortgage-interview-questions",
      excerpt: "A practical list of common mortgage operations and underwriting interview questions and how to approach them.",
      content: "# Common Mortgage Interview Questions\n\nPreparing for mortgage interviews is easier when you know what to expect.\n\n## Conceptual\n\n- What is the mortgage lifecycle?\n- Explain DTI, LTV and CLTV.\n- What is the role of AUS?\n\n## Scenario-based\n\n- How would you handle a file with missing income documents?\n- What red flags would you look for in a self-employed borrower file?\n\n## Behavioural\n\n- Tell me about a time you caught a critical error.\n- How do you prioritise when handling multiple files?",
      categoryName: "Interview Preparation",
    },
    {
      title: "How Practical Case Studies Help Mortgage Candidates Become Job-Ready",
      slug: "how-practical-case-studies-help-mortgage-candidates",
      excerpt: "Why case-study based learning is one of the most effective ways to become job-ready for mortgage operations.",
      content: "# How Practical Case Studies Help Mortgage Candidates Become Job-Ready\n\nCase-study based learning bridges the gap between theory and on-the-job performance.\n\n## Why case studies work\n\n- Simulate real loan files\n- Build decision-making instinct\n- Surface edge cases\n- Improve documentation review skills\n\nAt VertexIT, every program is built around practical case studies to ensure candidates are job-ready from day one.",
      categoryName: "Career Advice",
    },
  ];
  let blogCount = 0;
  for (const post of blogDrafts) {
    const existing = await db.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) continue;
    await db.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: "VertexIT",
        categoryId: catMap[post.categoryName],
        tags: post.tags || "",
        isPublished: false, // drafts — admin reviews & publishes
        isDemo: false,
        metaTitle: post.title,
        metaDescription: post.excerpt,
      },
    });
    blogCount++;
  }
  console.log(`✓ ${blogCount} blog drafts (unpublished)`);

  // 8. Demo trainers (unpublished)
  const demoTrainers = [
    { name: "Demo Trainer — US Mortgage", designation: "Senior US Mortgage Underwriter (Demo)", specialization: "US Mortgage Underwriting", bio: "This is a sample trainer profile. Admin can replace this with real trainer details in the CMS.", experience: null },
    { name: "Demo Trainer — Australia Mortgage", designation: "Australian Mortgage Operations Lead (Demo)", specialization: "Australian Mortgage Operations", bio: "This is a sample trainer profile. Admin can replace this with real trainer details in the CMS.", experience: null },
  ];
  for (const t of demoTrainers) {
    const existing = await db.trainer.findFirst({ where: { name: t.name } });
    if (!existing) {
      await db.trainer.create({ data: { ...t, isPublished: false, isDemo: true, sortOrder: 0 } });
    }
  }
  console.log("✓ Demo trainers (unpublished)");

  // 9. Demo testimonials (unpublished)
  for (let i = 1; i <= 3; i++) {
    const name = `Demo Student ${i}`;
    const existing = await db.testimonial.findFirst({ where: { studentName: name } });
    if (!existing) {
      await db.testimonial.create({
        data: {
          studentName: name,
          course: i % 2 === 0 ? "Australia Mortgage" : "US Mortgage – Underwriting",
          quote: "This is a sample testimonial. Replace it with a real student review once available.",
          rating: 5,
          isPublished: false,
          isDemo: true,
          sortOrder: i,
        },
      });
    }
  }
  console.log("✓ Demo testimonials (unpublished)");

  // 10. Demo placement stories (unpublished)
  for (let i = 1; i <= 3; i++) {
    const name = `Demo Placed Student ${i}`;
    const existing = await db.placementStory.findFirst({ where: { studentName: name } });
    if (!existing) {
      await db.placementStory.create({
        data: {
          studentName: name,
          course: i % 2 === 0 ? "Australia Mortgage" : "US Mortgage – Underwriting",
          previousBackground: "Sample background",
          newRole: "Sample role",
          company: null, // do not invent employer
          package: null, // do not invent package
          location: "Bengaluru",
          year: new Date().getFullYear(),
          shortStory: "This is a sample placement story. Replace it with real student data once available.",
          isPublished: false,
          isDemo: true,
          sortOrder: i,
        },
      });
    }
  }
  console.log("✓ Demo placement stories (unpublished)");

  // 11. Demo jobs (unpublished)
  const demoJobs = [
    { title: "Mortgage Underwriter (US) — Demo", slug: "demo-mortgage-underwriter-us", domain: "us-mortgage-underwriting", location: "Bengaluru" },
    { title: "Mortgage Loan Processor (AU) — Demo", slug: "demo-mortgage-loan-processor-au", domain: "australia-mortgage", location: "Bengaluru" },
  ];
  for (const j of demoJobs) {
    const existing = await db.job.findUnique({ where: { slug: j.slug } });
    if (!existing) {
      await db.job.create({
        data: {
          title: j.title,
          slug: j.slug,
          company: "", // do not invent employer
          location: j.location,
          experience: "0-2 years",
          jobType: "Full-time",
          workMode: "Hybrid",
          courseDomain: j.domain,
          skills: "Loan file analysis\nDocumentation review\nCommunication",
          responsibilities: "Sample responsibilities — admin should update.",
          requirements: "Sample requirements — admin should update.",
          description: "This is a sample job. Admin should replace it with a real opening once available.",
          isPublished: false,
          isDemo: true,
        },
      });
    }
  }
  console.log("✓ Demo jobs (unpublished)");

  // 12. Homepage sections
  const sections = [
    { sectionKey: "hero", title: "Hero", enabled: true, sortOrder: 1 },
    { sectionKey: "trust-strip", title: "Trust / Value Strip", enabled: true, sortOrder: 2 },
    { sectionKey: "why-vertexit", title: "Why VertexIT", enabled: true, sortOrder: 3 },
    { sectionKey: "courses", title: "Courses", enabled: true, sortOrder: 4 },
    { sectionKey: "what-you-learn", title: "What You Will Learn", enabled: true, sortOrder: 5 },
    { sectionKey: "how-training-works", title: "How Training Works", enabled: true, sortOrder: 6 },
    { sectionKey: "placement-journey", title: "Placement Journey", enabled: true, sortOrder: 7 },
    { sectionKey: "career-pathways", title: "Career Pathways", enabled: true, sortOrder: 8 },
    { sectionKey: "jobs", title: "Current Job Opportunities", enabled: true, sortOrder: 9 },
    { sectionKey: "success-stories", title: "Success Stories", enabled: true, sortOrder: 10 },
    { sectionKey: "trainers", title: "Trainers / Mentors", enabled: true, sortOrder: 11 },
    { sectionKey: "faq", title: "FAQ", enabled: true, sortOrder: 12 },
    { sectionKey: "final-cta", title: "Final CTA", enabled: true, sortOrder: 13 },
  ];
  for (const s of sections) {
    const existing = await db.homepageSection.findUnique({ where: { sectionKey: s.sectionKey } });
    if (!existing) {
      await db.homepageSection.create({ data: s });
    }
  }
  console.log(`✓ ${sections.length} homepage sections`);

  console.log("\n✅ Seeding complete.");
  console.log("   Admin login: admin@vertexit.in / vertexit123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
