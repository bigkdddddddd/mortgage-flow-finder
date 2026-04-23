

## Dedicated Eligibility Check Landing Page

### Concept

A standalone, distraction-free landing page at `/eligibility` with a single clear goal: **"Find out how much you can borrow."** Minimal navigation (just the logo and one CTA), a multi-step questionnaire using mostly tap-to-select buttons (not free-text inputs), and a contact form as the final step before results are revealed.

### User Flow

```text
/eligibility

┌─────────────────────────────────────┐
│  Logo only     (no full nav menu)   │
│                                     │
│  "Find out how much you can borrow" │
│  "Answer a few quick questions —    │
│   takes under 2 minutes"           │
│                                     │
│  [ Get Started ]                    │
└─────────────────────────────────────┘
         │
         ▼
Step 1: "What's your situation?"
   ○ First home buyer
   ○ Upgrading / next home
   ○ Refinancing
   ○ Investment property

Step 2: "What's your gross annual income?"
   Slider: $40K – $500K  (tap-friendly)

Step 3: "Does a partner earn income too?"
   ○ Yes  ○ No
   → If yes: partner income slider

Step 4: "Monthly living expenses"
   ○ Under $2,000
   ○ $2,000 – $3,500
   ○ $3,500 – $5,000
   ○ $5,000+

Step 5: "Any existing debts?"
   ○ None
   ○ Under $500/mo
   ○ $500 – $1,500/mo
   ○ $1,500+/mo

Step 6: "How many dependents?"
   ○ 0  ○ 1  ○ 2  ○ 3+

Step 7: CONTACT GATE
   "You're almost there — enter your details
    to unlock your personalised estimate."
   Fields: Name, Email, Phone (3 fields only)
   [ Unlock My Results → ]

Step 8: RESULTS
   Full borrowing power, monthly repayment,
   blurred teaser upgrades to real numbers.
   CTA: "Book a Free Consultation"
```

### What Gets Built

**1. New page: `src/pages/Eligibility.tsx`**

- Self-contained landing page with its own minimal header (logo + "Call us" link only — no nav menu).
- Does NOT use `SiteLayout` — renders its own simplified wrapper to remove distractions.
- Progress bar at top showing step X of 7.
- Each step is a full-width centered card with large tap-friendly option buttons (radio-style selection cards, not dropdowns or text inputs).
- Steps 2 and 3 use sliders (reusing `FieldSlider` from shared.tsx) since they're numeric ranges — these are the only non-button inputs before the contact step.
- Step 7 (contact gate) shows a compact form with only 3 fields: name, email, phone. No topic dropdown (auto-set from step 1), no message textarea. Uses Zod validation from the existing LeadForm pattern.
- Step 8 shows the full results using `ResultCard` components, plus a "Book a Free Consultation" button linking to `/book`.
- Back button on each step. Smooth slide transitions between steps.

**2. New route in `src/App.tsx`**

- Add `/eligibility` as a top-level route outside the `SiteLayout` wrapper (so it has no header/footer chrome).

**3. Update `src/pages/Index.tsx`**

- Add a prominent CTA card/banner on the home page: "Check your borrowing power in under 2 minutes" linking to `/eligibility`.

**4. Update `src/components/forms/LeadForm.tsx`**

- Add `onSuccess` callback prop so the eligibility page can trigger result reveal on submission.
- Add `ctaLabel` prop for custom button text.

### Design Details

- Large, centered single-column layout (max-w-xl) for focus.
- Option buttons are full-width cards with a subtle border highlight on selection, using the existing accent/gold color.
- Progress bar uses the gold accent color.
- Results page shows a blurred teaser during the contact step, then animates to full reveal with a scale-up transition.
- Mobile-first: all buttons are large touch targets, no horizontal scrolling.
- Minimal footer: just "Meridian Mortgage · Privacy Policy" one-liner.

