import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Star, Calculator, Phone, Home, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FieldSlider, ResultCard } from "@/components/calculators/shared";
import { estimateBorrowingPower, periodicPayment } from "@/lib/finance";
import { supabase } from "@/integrations/supabase/client";

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

const TOTAL_STEPS = 8;

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
      selected ? "border-accent bg-accent/10 shadow-md ring-1 ring-accent/30" : "border-border bg-card",
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

const Eligibility = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    situation: "", income: 90000, hasPartner: "", partnerIncome: 0, expenses: "", debts: "", dependents: "",
  });
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const expenseMap: Record<string, number> = { "under-2000": 1500, "2000-3500": 2750, "3500-5000": 4250, "5000+": 6000 };
  const debtMap: Record<string, number> = { none: 0, "under-500": 300, "500-1500": 1000, "1500+": 2000 };
  const depMap: Record<string, number> = { "0": 0, "1": 1, "2": 2, "3+": 3 };

  const results = useMemo(() => {
    const monthlyExpenses = expenseMap[answers.expenses] ?? 2500;
    const monthlyDebts = debtMap[answers.debts] ?? 0;
    const deps = depMap[answers.dependents] ?? 0;
    const rate = 6.2;
    const term = 30;
    const bp = estimateBorrowingPower({ grossIncome: answers.income, partnerIncome: answers.hasPartner === "yes" ? answers.partnerIncome : 0, monthlyExpenses, existingDebtRepayments: monthlyDebts, dependents: deps, ratePct: rate, termYears: term });
    const monthly = periodicPayment(bp, rate, term);
    return { borrowingPower: bp, monthlyRepayment: monthly, rate, term, combinedIncome: answers.income + (answers.hasPartner === "yes" ? answers.partnerIncome : 0) };
  }, [answers]);

  const progressPercent = step === 0 ? 0 : Math.min(((step) / (TOTAL_STEPS - 1)) * 100, 100);

  const canAdvance = (): boolean => {
    if (step === 1) return !!answers.situation;
    if (step === 3) return !!answers.hasPartner && (answers.hasPartner === "no" || answers.partnerIncome >= 0);
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

    // Fire confirmation email via Resend (don't block on failure)
    try {
      const bp = Math.round(results.borrowingPower).toLocaleString();
      const html = `
        <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:auto;padding:24px;color:#1a1a1a;">
          <h1 style="font-size:22px;margin:0 0 12px;">Your borrowing estimate is ready, ${contact.name.split(" ")[0]} 🎉</h1>
          <p style="color:#555;line-height:1.5;">Based on what you shared, your estimated borrowing power is:</p>
          <div style="background:#f7f4ee;border:1px solid #e6dfd0;border-radius:12px;padding:20px;margin:16px 0;text-align:center;">
            <div style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:.06em;">Estimated borrowing power</div>
            <div style="font-size:32px;font-weight:600;margin-top:6px;color:#b8923b;">$${bp}</div>
          </div>
          <p style="color:#555;line-height:1.5;">This is indicative only. For a precise figure tailored to lender policy, book a free consultation and we'll take care of the rest.</p>
          <p style="margin-top:20px;"><a href="https://mortgage-flow-finder.lovable.app/book" style="background:#b8923b;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;">Book a Free Consultation →</a></p>
          <p style="color:#888;font-size:12px;margin-top:28px;">— The Meridian Mortgage team</p>
        </div>`;
      supabase.functions.invoke("send-email", {
        body: { to: contact.email, subject: "Your KM Financing borrowing estimate", html },
      }).catch((e) => console.warn("email failed", e));
    } catch (e) { console.warn(e); }

    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setStep(8);
    toast({ title: "Details received!", description: "Your personalised estimate is ready — and on its way to your inbox." });
  };

  /* ─── step content ─── */
  const renderStep = () => {
    switch (step) {
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
                <OptionCard key={o.val} label={o.label} sub={o.sub} selected={answers.situation === o.val} onClick={() => { setAnswers({ ...answers, situation: o.val }); setTimeout(next, 250); }} />
              ))}
            </div>
            <NextButton disabled={!canAdvance()} onClick={next} />
          </StepShell>
        );

      case 2:
        return (
          <StepShell title="What's your gross annual income?" sub="Before tax — your total salary package.">
            <div className="mt-2">
              <FieldSlider id="elig-income" label="Annual income" value={answers.income} min={30000} max={500000} step={5000} prefix="$" onChange={(v) => setAnswers({ ...answers, income: v })} />
            </div>
            <NextButton onClick={next} />
          </StepShell>
        );

      case 3:
        return (
          <StepShell title="Does a partner earn income too?" sub="Joint applications often increase borrowing power.">
            <div className="grid gap-3">
              <OptionCard label="Yes, we're applying together" selected={answers.hasPartner === "yes"} onClick={() => setAnswers({ ...answers, hasPartner: "yes" })} />
              <OptionCard label="No, just me" selected={answers.hasPartner === "no"} onClick={() => { setAnswers({ ...answers, hasPartner: "no", partnerIncome: 0 }); setTimeout(next, 250); }} />
            </div>
            {answers.hasPartner === "yes" && (
              <div className="mt-5 animate-fade-up">
                <FieldSlider id="elig-partner" label="Partner's annual income" value={answers.partnerIncome} min={0} max={500000} step={5000} prefix="$" onChange={(v) => setAnswers({ ...answers, partnerIncome: v })} />
              </div>
            )}
            <NextButton disabled={!canAdvance()} onClick={next} />
          </StepShell>
        );

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
                <OptionCard key={o.val} label={o.label} selected={answers.expenses === o.val} onClick={() => { setAnswers({ ...answers, expenses: o.val }); setTimeout(next, 250); }} />
              ))}
            </div>
            <NextButton disabled={!canAdvance()} onClick={next} />
          </StepShell>
        );

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
                <OptionCard key={o.val} label={o.label} selected={answers.debts === o.val} onClick={() => { setAnswers({ ...answers, debts: o.val }); setTimeout(next, 250); }} />
              ))}
            </div>
            <NextButton disabled={!canAdvance()} onClick={next} />
          </StepShell>
        );

      case 6:
        return (
          <StepShell title="How many dependents?" sub="Children or anyone financially dependent on you.">
            <div className="grid grid-cols-2 gap-3">
              {["0", "1", "2", "3+"].map((v) => (
                <OptionCard key={v} label={v === "3+" ? "3 or more" : v} selected={answers.dependents === v} onClick={() => { setAnswers({ ...answers, dependents: v }); setTimeout(next, 250); }} />
              ))}
            </div>
            <NextButton disabled={!canAdvance()} onClick={next} />
          </StepShell>
        );

      case 7:
        return (
          <StepShell title="You're almost there!" sub="Enter your details to get your personalised borrowing estimate.">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 mb-6">
              <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
              <p className="text-sm text-foreground">Your estimate is ready! Just pop in your details and we'll show you the result.</p>
            </div>
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
                We'll email you a copy and a broker may follow up. No spam, ever.
              </p>
            </form>
          </StepShell>
        );

      case 8:
        return (
          <div className="animate-fade-up">
            <div className="text-center mb-8">
              <div className="mx-auto h-14 w-14 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl">Here's your estimate, {contact.name.split(" ")[0]}!</h2>
              <p className="text-sm text-muted-foreground mt-2">Based on the details you provided. A copy has been emailed to you.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <ResultCard label="Estimated borrowing power" value={`$${Math.round(results.borrowingPower).toLocaleString()}`} accent />
              <ResultCard label="Combined gross income" value={`$${results.combinedIncome.toLocaleString()}`} />
            </div>

            {/* PROMINENT consultation CTA */}
            <Card className="relative overflow-hidden p-6 sm:p-8 mb-6 border-2 border-accent/40 bg-gradient-to-br from-accent/15 via-accent/5 to-transparent shadow-elegant">
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
              <div className="relative flex items-start gap-4">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-[0.18em] text-accent font-bold mb-1">Want a precise figure?</div>
                  <h3 className="font-display text-xl sm:text-2xl leading-tight">
                    Book a free consultation and unlock your real borrowing power.
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    A KM Financing Broker will tailor an exact figure to lender policy — 30 minutes, zero obligation.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                <Button asChild variant="gold" size="lg" className="w-full">
                  <Link to="/book">Book a Free Consultation <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href="tel:0410 391 183"><Phone className="h-4 w-4" /> Call Us Now</a>
                </Button>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-card border-border">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Estimated at {results.rate}% p.a. over {results.term} years (principal & interest)</p>
                <p>• Includes APRA 3% serviceability buffer</p>
                <p>• Indicative only — not a lending offer or guarantee</p>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal header — Home button CENTERED */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-xl mx-auto px-4 h-14 grid grid-cols-3 items-center">
          <Link to="/" className="font-display text-lg tracking-tight justify-self-start">
            <span className="text-accent">Meridian</span>
          </Link>
          <Link to="/" className="justify-self-center inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent hover:text-accent transition-colors">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <a href="tel:1300000000" className="justify-self-end text-xs text-muted-foreground hover:text-accent inline-flex items-center gap-1.5 transition-colors">
            <Phone className="h-3.5 w-3.5" /> <span className="hidden sm:inline">1300 000 000</span>
          </a>
        </div>
      </header>

      {step > 0 && step < 8 && (
        <div className="max-w-xl mx-auto w-full px-4 pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Step {Math.min(step, 7)} of 7</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          {step > 0 && step < 8 && (
            <button onClick={back} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}
          {renderStep()}
        </div>
      </main>

      <section className="border-t border-border py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground font-medium mb-6">We compare 40+ lenders to find you the best deal</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {["Westpac", "CommBank", "ANZ", "NAB", "St. George", "Macquarie", "ING", "Suncorp", "BOQ", "Bankwest", "ME Bank", "Firstmac", "Auswide Bank", "Teachers Mutual"].map((name) => (
              <span key={name} className="text-xs sm:text-sm font-semibold text-muted-foreground/70 tracking-wide uppercase">{name}</span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Meridian Mortgage · <Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link> · <Link to="/contact" className="hover:text-accent transition-colors">Privacy</Link>
      </footer>
    </div>
  );
};

const StepShell = ({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) => (
  <div className="animate-fade-up">
    <h2 className="font-display text-2xl sm:text-3xl font-medium">{title}</h2>
    {sub && <p className="text-sm text-muted-foreground mt-2 mb-6">{sub}</p>}
    {children}
  </div>
);

const NextButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => (
  <Button onClick={onClick} variant="gold" size="lg" className="w-full mt-6" disabled={disabled}>
    Next <ArrowRight className="h-4 w-4" />
  </Button>
);

export default Eligibility;
