export const services = [
  {
    slug: "first-home-buyers",
    title: "First-Home Buyers",
    icon: "Home",
    blurb: "Step-by-step guidance, government scheme eligibility checks, and lender matching tailored for first-time buyers.",
    points: ["Pre-approval support", "Deposit & grant guidance", "Lender comparison", "End-to-end settlement help"],
  },
  {
    slug: "refinancing",
    title: "Refinancing",
    icon: "Repeat",
    blurb: "Lower your rate, unlock equity, or restructure repayments. We benchmark your loan against 40+ lenders.",
    points: ["Rate review every 12 months", "Cashback offer matching", "Equity release strategies", "No-cost benchmarking"],
  },
  {
    slug: "investment-loans",
    title: "Investment Loans",
    icon: "TrendingUp",
    blurb: "Build a property portfolio with smart loan structuring, interest-only options, and offset strategies.",
    points: ["Portfolio structuring", "Tax-aware features", "IO & P&I comparisons", "SMSF lending support"],
  },
  {
    slug: "construction-loans",
    title: "Construction Loans",
    icon: "HardHat",
    blurb: "Specialist progress-payment loans for new builds, knockdown rebuilds, and major renovations.",
    points: ["Progress draw guidance", "Builder contract review", "Land + construction packages", "Valuation coordination"],
  },
  {
    slug: "commercial-finance",
    title: "Commercial Finance",
    icon: "Building2",
    blurb: "Funding for commercial property, business expansion, equipment, and asset finance.",
    points: ["Commercial property loans", "Business expansion finance", "Asset & equipment finance", "Cash flow lending"],
  },
  {
    slug: "debt-consolidation",
    title: "Debt Consolidation",
    icon: "Layers",
    blurb: "Combine high-interest debts into a single, lower-rate facility to simplify payments and free up cash flow.",
    points: ["Single repayment", "Reduced interest cost", "Credit health roadmap", "Budget review"],
  },
  {
    slug: "self-employed",
    title: "Self-Employed Lending",
    icon: "Briefcase",
    blurb: "Specialist low-doc and full-doc solutions for sole traders, contractors, and business owners.",
    points: ["Low-doc options", "ABN holder programs", "Contractor lending", "Director income solutions"],
  },
] as const;

export const testimonials = [
  {
    name: "Sarah & James M.",
    role: "First-Home Buyers · Brisbane",
    rating: 5,
    quote: "Meridian made buying our first home feel genuinely manageable. Pre-approval came through in five days and they negotiated a rate well below what our bank offered.",
    saved: "$412/mo",
  },
  {
    name: "Priya R.",
    role: "Refinance · Sydney",
    rating: 5,
    quote: "I was paying 6.89% with my old lender. Within three weeks Meridian had me on 5.74% with a $3,000 cashback. The whole process was effortless.",
    saved: "$589/mo",
  },
  {
    name: "Daniel K.",
    role: "Investment Portfolio · Melbourne",
    rating: 5,
    quote: "We've now financed four properties together. The structuring advice alone has saved us tens of thousands and unlocked equity I didn't know we had.",
    saved: "4 properties",
  },
  {
    name: "The Nguyen Family",
    role: "Construction Loan · Perth",
    rating: 5,
    quote: "Construction finance is complex, but our broker walked us through every progress payment. We never felt out of the loop.",
    saved: "12-week settle",
  },
  {
    name: "Marcus T.",
    role: "Self-Employed · Adelaide",
    rating: 5,
    quote: "Three banks said no. Meridian found a lender who understood my contracting income and approved me within a fortnight.",
    saved: "Approved in 14d",
  },
  {
    name: "Elena & Tom",
    role: "Refinance + Equity · Gold Coast",
    rating: 5,
    quote: "Released $180k of equity for a renovation while reducing our monthly repayments. Truly client-first advice.",
    saved: "$180k equity",
  },
] as const;

export const faqs = [
  {
    q: "How does a mortgage broker get paid?",
    a: "We're paid a commission by the lender once your loan settles, at no direct cost to you. We disclose all commissions in writing before you proceed, and our recommendation is always based on what's right for your situation — not on commission rates.",
  },
  {
    q: "How long does pre-approval take?",
    a: "Most pre-approvals are returned within 3–5 business days, though some lenders can issue conditional approval within 24 hours. The exact timeframe depends on the lender, your documentation, and credit assessment requirements.",
  },
  {
    q: "How many lenders do you compare?",
    a: "We have access to 40+ lenders including the major banks, regional banks, credit unions, and specialist non-bank lenders. We typically shortlist 3–5 options that genuinely suit your circumstances.",
  },
  {
    q: "What documents will I need?",
    a: "Generally: photo ID, two recent payslips, three months of bank statements, your latest group certificate or tax return, and details of any existing debts or assets. We'll send a personalised checklist after our first call.",
  },
  {
    q: "Can you help if I'm self-employed?",
    a: "Absolutely. We work with lenders who accept BAS statements, accountant declarations, and alternative income verification. Self-employed lending is one of our specialties.",
  },
  {
    q: "Will applying affect my credit score?",
    a: "A formal application creates a credit enquiry. We won't submit anything to a lender until we've assessed your situation and you've agreed to proceed — so you stay in full control.",
  },
  {
    q: "Do I need a 20% deposit?",
    a: "No. Many lenders accept 5–10% deposits, sometimes with Lenders Mortgage Insurance (LMI). Government schemes for first-home buyers may waive LMI entirely. We'll walk you through the trade-offs.",
  },
  {
    q: "How often should I review my home loan?",
    a: "We recommend a complimentary annual rate review. Lender pricing changes constantly and a 0.3% reduction on a $600k loan can save over $1,800 a year.",
  },
] as const;

export const lenderLogos = [
  "Atlas Bank", "Northgate", "Heritage Mutual", "Ironbark", "Sandstone Credit",
  "Pacific Lend", "Crestline", "Meridian Direct", "Vantage", "Summit Finance",
  "Beacon Loans", "Capital First",
] as const;

export const blogPosts = [
  {
    slug: "first-home-buyer-guide-2025",
    title: "The Complete First-Home Buyer Guide for 2025",
    excerpt: "Deposits, schemes, pre-approval, settlement — everything you need to navigate your first purchase with confidence.",
    category: "First Home",
    readTime: "8 min read",
    date: "Mar 18, 2025",
  },
  {
    slug: "refinance-checklist",
    title: "When (and When Not) to Refinance Your Mortgage",
    excerpt: "Six signals it's time to switch lenders, and three reasons to hold off. A practical decision framework.",
    category: "Refinancing",
    readTime: "6 min read",
    date: "Mar 02, 2025",
  },
  {
    slug: "offset-vs-redraw",
    title: "Offset vs Redraw: Which Saves You More?",
    excerpt: "A side-by-side comparison of two of the most misunderstood loan features — with real-world numbers.",
    category: "Loan Features",
    readTime: "5 min read",
    date: "Feb 14, 2025",
  },
  {
    slug: "investment-property-structuring",
    title: "Smart Loan Structuring for Property Investors",
    excerpt: "How interest-only periods, offset accounts, and ownership structures interact to maximise your returns.",
    category: "Investment",
    readTime: "9 min read",
    date: "Jan 28, 2025",
  },
  {
    slug: "self-employed-borrower",
    title: "Self-Employed and Need a Home Loan? Read This First",
    excerpt: "Lenders that say yes, documents you'll need, and how to position your application for approval.",
    category: "Self-Employed",
    readTime: "7 min read",
    date: "Jan 10, 2025",
  },
  {
    slug: "rate-rise-stress-test",
    title: "Stress-Testing Your Loan Against Future Rate Rises",
    excerpt: "A simple framework to make sure your repayments stay manageable, whatever the cash rate does next.",
    category: "Strategy",
    readTime: "5 min read",
    date: "Dec 19, 2024",
  },
] as const;

export const calculators = [
  { slug: "borrowing-power", title: "Borrowing Power", icon: "Wallet", desc: "Estimate how much you could borrow based on your income, expenses, and existing debts." },
  { slug: "repayments", title: "Mortgage Repayments", icon: "Calculator", desc: "Calculate weekly, fortnightly, or monthly repayments across loan terms and interest rates." },
  { slug: "refinance-savings", title: "Refinance Savings", icon: "PiggyBank", desc: "See how much you could save by switching to a sharper rate." },
  { slug: "stamp-duty", title: "Closing Costs", icon: "Receipt", desc: "Estimate stamp duty, government fees, and other upfront purchase costs." },
  { slug: "extra-repayments", title: "Extra Repayments", icon: "Zap", desc: "Discover how small extra repayments can shave years off your loan." },
  { slug: "loan-comparison", title: "Loan Comparison", icon: "GitCompare", desc: "Compare two loans side-by-side, including fees and rate differences." },
  { slug: "offset", title: "Offset Savings", icon: "Banknote", desc: "Estimate the interest you could save with an offset account balance." },
] as const;
