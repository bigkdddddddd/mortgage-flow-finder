import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Lock, CheckCircle2, ShieldCheck, Star, Calculator, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FieldSlider, ResultCard } from "@/components/calculators/shared";
import { borrowingPower, monthlyRepayment } from "@/lib/finance";

/* ─── types ─── */
interface Answers {
  situation: string;
  income: number;
  hasPartner: string;
  partnerIncome: number;
  expenses: string;
  debts: string;
  dependents: string;
}

const TOTAL_STEPS = 8; // intro(0) + 6 questions + contact(7) + results(hidden as 8)

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(20),
});

/* ─── option card ─── */
const OptionCard = ({ label, selected, onClick, sub }: { label: string; selected: boolean; onClick: () => void; sub?: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "w-full text-left rounded-xl border-2 p-5 transition-all duration-200",
      "hover:border-accent/60 hover:shadow-md",
      selected
        ? "border-accent bg-accent/10 shadow-md ring-1 ring-accent/30"
        : "border-border bg-card",
    )}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-[15px]">{label}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      <div className={cn(
        "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
        selected ? "border-accent bg-accent" : "border-muted-foreground/30",
      )}>
        {selected && <div className="h-2 w-2 rounded-full bg-accent-foreground" />}
      </div>
    </div>
  </button>
);

/* ─── main component ─── */
const Eligibility = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    situation: "",
    income: 90000,
    hasPartner: "",
    partnerIncome: 0,
    expenses: "",
    debts: "",
    dependents: "",
  });
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  /* ─── derived values ─── */
  const expenseMap: Record<string, number> = { "under-2000": 1500, "2000-3500": 2750, "3500-5000": 4250, "5000+": 6000 };
  const debtMap: Record<string, number> = { none: 0, "under-500": 300, "500-1500": 1000, "1500+": 2000 };
  const depMap: Record<string, number> = { "0": 0, "1": 1, "2": 2, "3+": 3 };

  const results = useMemo(() => {
    const monthlyExpenses = expenseMap[answers.expenses] ?? 2500;
    const monthlyDebts = debtMap[answers.debts] ?? 0;
    const deps = depMap[answers.dependents] ?? 0;
    const rate = 6.2;
    const term = 30;
    const bp = borrowingPower(answers.income, answers.hasPartner === "yes" ? answers.partnerIncome : 0, monthlyExpenses, monthlyDebts, deps, rate);
    const monthly = monthlyRepayment(bp, rate, term);
    return { borrowingPower: bp, monthlyRepayment: monthly, rate, term, combinedIncome: answers.income + (answers.hasPartner === "yes" ? answers.partnerIncome : 0) };
  }, [answers]);

  const rangeText = useMemo(() => {
    const low = Math.round(results.borrowingPower * 0.9 / 10000) * 10000;
    const high = Math.round(results.borrowingPower * 1.1 / 10000) * 10000;
    const fmt = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`;
    return `${fmt(low)} – ${fmt(high)}`;
  }, [results.borrowingPower]);

  const progressPercent = step === 0 ? 0 : Math.min(((step) / (TOTAL_STEPS - 1)) * 100, 100);

  const canAdvance = (): boolean => {
    if (step === 1) return !!answers.situation;
    if (step === 3) return !!answers.hasPartner;
    if (step === 4) return !!answers.expenses;
    if (step === 5) return !!answers.debts;
    if (step === 6) return !!answers.dependents;
    return true;
  };

  const next = () => { if (canAdvance()) setStep((s) => s + 1); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parse = contactSchema.safeParse(contact);
    if (!parse.success) {
      const errs: Record<string, string> = {};
      parse.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setContactErrors(errs);
      return;
    }
    setContactErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setUnlocked(true);
    setStep(8);
    toast({ title: "Details received!", description: "Your personalised estimate is ready." });
  };

  const topicFromSituation: Record<string, string> = {
    "first-home": "first-home",
    "next-home": "next-home",
    "refinance": "refinance",
    "investment": "investment",
  };

  /* ─── step content ─── */
  const renderStep = () => {
    switch (step) {
      /* ── Intro ── */
      case 0:
        return (
          <div className="text-center animate-fade-up">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mb-6">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-balance">
              Find out how much<br />you can borrow
            </h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
              Answer a few quick questions — takes under 2 minutes. No credit check required.
            </p>
            <Button onClick={next} variant="gold" size="xl" className="mt-8 px-10">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> No credit check</span>
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-accent" /> 100% private</span>
              <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-accent" /> Free estimate</span>
            </div>
          </div>
        );

      /* ── Step 1: Situation ── */
      case 1:
        return (
          <StepShell title="What's your situation?" sub="This helps us tailor your estimate.">
            <div className="grid gap-3">
              {[
                { val: "first-home", label: "Buying my first home", sub: "First-time buyer" },
                { val: "next-home", label: "Upgrading or buying next home" },
                { val: "refinance", label: "Refinancing my current loan" },
                { val: "investment", label: "Purchasing an investment property" },
              ].map((o) => (
                <OptionCard key={o.val} label={o.label} sub={o.sub} selected={answers.situation === o.val} onClick={() => { setAnswers({ ...answers, situation: o.val }); setTimeout(next, 300); }} />
              ))}
            </div>
          </StepShell>
        );

      /* ── Step 2: Income ── */
      case 2:
        return (
          <StepShell title="What's your gross annual income?" sub="Before tax — your total salary package.">
            <div className="mt-2">
              <FieldSlider label="Annual income" value={answers.income} min={30000} max={500000} step={5000} prefix="$" onChange={(v) => setAnswers({ ...answers, income: v })} />
            </div>
            <Button onClick={next} variant="gold" size="lg" className="w-full mt-6">Continue <ArrowRight className="h-4 w-4" /></Button>
          </StepShell>
        );

      /* ── Step 3: Partner ── */
      case 3:
        return (
          <StepShell title="Does a partner earn income too?" sub="Joint applications often increase borrowing power.">
            <div className="grid gap-3">
              <OptionCard label="Yes, we're applying together" selected={answers.hasPartner === "yes"} onClick={() => setAnswers({ ...answers, hasPartner: "yes" })} />
              <OptionCard label="No, just me" selected={answers.hasPartner === "no"} onClick={() => { setAnswers({ ...answers, hasPartner: "no", partnerIncome: 0 }); setTimeout(next, 300); }} />
            </div>
            {answers.hasPartner === "yes" && (
              <div className="mt-5 animate-fade-up">
                <FieldSlider label="Partner's annual income" value={answers.partnerIncome} min={0} max={500000} step={5000} prefix="$" onChange={(v) => setAnswers({ ...answers, partnerIncome: v })} />
                <Button onClick={next} variant="gold" size="lg" className="w-full mt-4">Continue <ArrowRight className="h-4 w-4" /></Button>
              </div>
            )}
          </StepShell>
        );

      /* ── Step 4: Expenses ── */
      case 4:
        return (
          <StepShell title="Monthly living expenses?" sub="Rough estimate is fine — rent, groceries, utilities, etc.">
            <div className="grid gap-3">
              {[
                { val: "under-2000", label: "Under $2,000/mo" },
                { val: "2000-3500", label: "$2,000 – $3,500/mo" },
                { val: "3500-5000", label: "$3,500 – $5,000/mo" },
                { val: "5000+", label: "$5,000+/mo" },
              ].map((o) => (
                <OptionCard key={o.val} label={o.label} selected={answers.expenses === o.val} onClick={() => { setAnswers({ ...answers, expenses: o.val }); setTimeout(next, 300); }} />
              ))}
            </div>
          </StepShell>
        );

      /* ── Step 5: Debts ── */
      case 5:
        return (
          <StepShell title="Any existing debt repayments?" sub="Car loans, credit cards, personal loans, HECS/HELP, etc.">
            <div className="grid gap-3">
              {[
                { val: "none", label: "None" },
                { val: "under-500", label: "Under $500/mo" },
                { val: "500-1500", label: "$500 – $1,500/mo" },
                { val: "1500+", label: "$1,500+/mo" },
              ].map((o) => (
                <OptionCard key={o.val} label={o.label} selected={answers.debts === o.val} onClick={() => { setAnswers({ ...answers, debts: o.val }); setTimeout(next, 300); }} />
              ))}
            </div>
          </StepShell>
        );

      /* ── Step 6: Dependents ── */
      case 6:
        return (
          <StepShell title="How many dependents?" sub="Children or anyone financially dependent on you.">
            <div className="grid grid-cols-2 gap-3">
              {["0", "1", "2", "3+"].map((v) => (
                <OptionCard key={v} label={v === "3+" ? "3 or more" : v} selected={answers.dependents === v} onClick={() => { setAnswers({ ...answers, dependents: v }); setTimeout(next, 300); }} />
              ))}
            </div>
          </StepShell>
        );

      /* ── Step 7: Contact gate ── */
      case 7:
        return (
          <StepShell title="You're almost there!" sub="Enter your details to unlock your personalised estimate.">
            {/* Blurred teaser */}
            <Card className="p-5 mb-6 bg-gradient-card border-border relative overflow-hidden">
              <div className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">Your estimated borrowing power</div>
              <div className="font-display text-3xl blur-[8px] select-none">{rangeText}</div>
              <div className="absolute inset-0 flex items-center justify-center bg-card/60 backdrop-blur-[2px]">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Lock className="h-4 w-4" /> Enter details to unlock
                </div>
              </div>
            </Card>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Label htmlFor="elig-name">Full name</Label>
                <Input id="elig-name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Jane Doe" className="mt-1.5" />
                {contactErrors.name && <p className="text-xs text-destructive mt-1">{contactErrors.name}</p>}
              </div>
              <div>
                <Label htmlFor="elig-email">Email</Label>
                <Input id="elig-email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@example.com" className="mt-1.5" />
                {contactErrors.email && <p className="text-xs text-destructive mt-1">{contactErrors.email}</p>}
              </div>
              <div>
                <Label htmlFor="elig-phone">Phone</Label>
                <Input id="elig-phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="04xx xxx xxx" className="mt-1.5" />
                {contactErrors.phone && <p className="text-xs text-destructive mt-1">{contactErrors.phone}</p>}
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Unlocking…" : "Unlock My Results"} <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                We'll never spam you. A broker may follow up to discuss your options.
              </p>
            </form>
          </StepShell>
        );

      /* ── Step 8: Results ── */
      case 8:
        return (
          <div className="animate-fade-up">
            <div className="text-center mb-8">
              <div className="mx-auto h-14 w-14 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl">Here's your estimate, {contact.name.split(" ")[0]}!</h2>
              <p className="text-sm text-muted-foreground mt-2">Based on the details you provided. For a precise figure, book a free consultation.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <ResultCard label="Estimated borrowing power" value={`$${Math.round(results.borrowingPower).toLocaleString()}`} accent />
              <ResultCard label="Monthly repayment" value={`$${Math.round(results.monthlyRepayment).toLocaleString()}`} />
              <ResultCard label="Combined income" value={`$${results.combinedIncome.toLocaleString()}`} />
            </div>

            <Card className="p-5 bg-gradient-card border-border mb-6">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Estimated at {results.rate}% p.a. over {results.term} years (principal & interest)</p>
                <p>• Includes APRA 3% serviceability buffer</p>
                <p>• This is an indicative estimate only — not a lending offer or guarantee</p>
              </div>
            </Card>

            <div className="grid sm:grid-cols-2 gap-3">
              <Button asChild variant="gold" size="lg" className="w-full">
                <Link to="/book">Book a Free Consultation <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <a href="tel:1300000000"><Phone className="h-4 w-4" /> Call Us Now</a>
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-display text-lg tracking-tight">
            <span className="text-accent">Meridian</span> Mortgage
          </Link>
          <a href="tel:1300000000" className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1.5 transition-colors">
            <Phone className="h-3.5 w-3.5" /> 1300 000 000
          </a>
        </div>
      </header>

      {/* Progress */}
      {step > 0 && step < 8 && (
        <div className="max-w-xl mx-auto w-full px-4 pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Step {Math.min(step, 7)} of 7</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          {/* Back button */}
          {step > 0 && step < 8 && (
            <button onClick={back} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}
          {renderStep()}
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Meridian Mortgage · <Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link> · <Link to="/contact" className="hover:text-accent transition-colors">Privacy</Link>
      </footer>
    </div>
  );
};

/* ─── step wrapper ─── */
const StepShell = ({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) => (
  <div className="animate-fade-up">
    <h2 className="font-display text-2xl sm:text-3xl font-medium">{title}</h2>
    {sub && <p className="text-sm text-muted-foreground mt-2 mb-6">{sub}</p>}
    {children}
  </div>
);

export default Eligibility;
