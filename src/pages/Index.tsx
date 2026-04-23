import { Link } from "react-router-dom";
import { ArrowRight, Star, ShieldCheck, Award, Clock, Users, CheckCircle2, Calculator, Home, Repeat, TrendingUp, HardHat, Building2, Layers, Briefcase, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, Eyebrow } from "@/components/layout/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { services, testimonials, lenderLogos } from "@/data/site";
import heroImg from "@/assets/hero-home.jpg";
import keysImg from "@/assets/keys-couple.jpg";

const iconMap = { Home, Repeat, TrendingUp, HardHat, Building2, Layers, Briefcase } as const;

const Index = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="container-wide relative grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="animate-fade-up">
            <Eyebrow>Trusted by 2,400+ Australian families</Eyebrow>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-medium mt-5 leading-[1.05] text-balance">
              The right home loan, <span className="text-accent italic">brokered</span> for you.
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl leading-relaxed text-pretty">
              We compare 40+ lenders to secure sharper rates, smarter structures, and faster approvals — without the bank-branch runaround.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/book">Book your free consultation <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="hero-outline" size="xl">
                <Link to="/contact">Get pre-qualified</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2"><div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}</div><span>4.9 from 380+ reviews</span></div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> ACL #389328</div>
              <div className="flex items-center gap-2"><Award className="h-4 w-4 text-accent" /> MFAA member</div>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="absolute -inset-4 bg-accent/10 rounded-3xl blur-2xl" />
            <img src={heroImg} alt="Modern luxury home at golden hour" width={1920} height={1280} className="relative rounded-2xl shadow-elegant aspect-[4/3] object-cover" />
            <Card className="absolute -bottom-6 -left-4 sm:-left-8 p-4 sm:p-5 w-56 sm:w-64 bg-card border-border shadow-elegant hidden sm:block">
              <div className="text-xs uppercase tracking-wider text-accent font-semibold">Avg. saving</div>
              <div className="font-display text-2xl mt-1">$487/mo</div>
              <div className="text-xs text-muted-foreground mt-1">vs. clients' previous lender</div>
            </Card>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border bg-card/40">
        <div className="container-wide py-8">
          <div className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Lender panel of 40+ — including</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-5 items-center">
            {lenderLogos.slice(0, 12).map((name) => (
              <div key={name} className="text-center font-display text-foreground/40 text-sm tracking-wide hover:text-foreground/70 transition-colors">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <Section spacing="lg">
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow className="justify-center">Why Meridian</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mt-4 text-balance">Independent advice. Genuine outcomes.</h2>
          <p className="mt-5 text-muted-foreground text-pretty">A modern broker experience built around clarity, speed, and the kind of advice you'd give a close friend.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {[
            { icon: Users, title: "Personal & independent", desc: "Your own broker, not a call centre. We work for you — not the lenders." },
            { icon: Clock, title: "Fast pre-approvals", desc: "Most clients receive a pre-approval response within 3–5 business days." },
            { icon: ShieldCheck, title: "Compliance-first", desc: "Best-interests duty, written commission disclosure, transparent every step." },
          ].map((b, i) => (
            <Card key={i} className="p-7 bg-gradient-card border-border/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="h-11 w-11 rounded-lg bg-accent-soft text-accent-foreground flex items-center justify-center"><b.icon className="h-5 w-5" /></div>
              <h3 className="font-display text-xl mt-5">{b.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{b.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section className="bg-gradient-subtle" spacing="lg">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <Eyebrow>Specialties</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mt-4 max-w-xl text-balance">Lending across every life stage.</h2>
          </div>
          <Button asChild variant="ghost"><Link to="/services">All services <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.slice(0, 6).map((s) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap];
            return (
              <Link key={s.slug} to="/services" className="group">
                <Card className="p-6 h-full bg-card border-border/60 hover:border-accent/40 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="h-11 w-11 rounded-lg bg-primary text-primary-foreground flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-display text-lg mt-5">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.blurb}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ELIGIBILITY CTA */}
      <Section spacing="lg">
        <Card className="p-8 sm:p-12 bg-gradient-hero text-primary-foreground rounded-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative">
            <Calculator className="h-10 w-10 text-accent mx-auto mb-4" />
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-balance">Check your borrowing power in under 2 minutes</h2>
            <p className="mt-3 text-primary-foreground/75 max-w-lg mx-auto">Answer a few simple questions and get an instant estimate — no credit check, no commitment.</p>
            <Button asChild variant="hero" size="xl" className="mt-6">
              <Link to="/eligibility">Check Eligibility <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </Card>
      </Section>

      {/* CALCULATORS PREVIEW */}
      <Section spacing="lg">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
          <div>
            <Eyebrow>Tools</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mt-4 text-balance">Smart calculators to plan with confidence.</h2>
            <p className="mt-5 text-muted-foreground text-pretty leading-relaxed">From borrowing power to refinance savings — our suite of calculators helps you model decisions before you make them. Then talk to a broker for tailored advice.</p>
            <Button asChild variant="default" size="lg" className="mt-7"><Link to="/calculators">Explore all calculators <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Borrowing power", desc: "How much could you borrow?", icon: Calculator, slug: "borrowing-power" },
              { title: "Repayments", desc: "Weekly, fortnightly, monthly", icon: Calculator, slug: "repayments" },
              { title: "Refinance savings", desc: "What could you save?", icon: Calculator, slug: "refinance-savings" },
              { title: "Closing costs", desc: "Stamp duty + government fees", icon: Calculator, slug: "stamp-duty" },
            ].map((c) => (
              <Link key={c.slug} to="/calculators" className="group">
                <Card className="p-5 h-full bg-gradient-card border-border/60 hover:border-accent/50 hover:shadow-md transition-all">
                  <div className="h-9 w-9 rounded-md bg-accent-soft text-accent-foreground flex items-center justify-center mb-3"><c.icon className="h-4 w-4" /></div>
                  <div className="font-display text-base">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
                  <div className="text-xs text-accent font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">Open tool <ArrowRight className="h-3 w-3" /></div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* PROCESS */}
      <Section className="bg-primary text-primary-foreground" spacing="lg">
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow className="justify-center">How it works</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mt-4 text-balance">From first call to keys in hand.</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-5 mt-12">
          {[
            { n: "01", t: "Discovery call", d: "A 30-min chat to understand your goals, timeline, and situation. No commitment." },
            { n: "02", t: "Strategy & options", d: "We shortlist 3–5 lenders and structure options tailored to you, with full cost comparisons." },
            { n: "03", t: "Application & approval", d: "We prepare the application, manage the lender, and chase approval — you stay in the loop." },
            { n: "04", t: "Settlement & beyond", d: "We coordinate settlement and review your loan annually to keep your rate sharp." },
          ].map((s) => (
            <div key={s.n} className="relative p-6 rounded-xl bg-primary-foreground/[0.04] border border-primary-foreground/10 hover:border-accent/40 transition-colors">
              <div className="font-display text-accent text-3xl">{s.n}</div>
              <div className="font-display text-xl mt-3">{s.t}</div>
              <p className="text-sm text-primary-foreground/70 mt-2 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section spacing="lg">
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow className="justify-center">Client stories</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mt-4 text-balance">Real outcomes, real Australians.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {testimonials.slice(0, 3).map((t, i) => (
            <Card key={i} className="p-7 bg-gradient-card border-border/60 flex flex-col">
              <div className="flex">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}</div>
              <p className="mt-4 text-foreground/85 leading-relaxed text-[15px]">"{t.quote}"</p>
              <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.role}</div>
                </div>
                <div className="text-accent font-display text-lg">{t.saved}</div>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="ghost"><Link to="/testimonials">Read more stories <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </Section>

      {/* CTA + LEAD FORM */}
      <Section className="bg-gradient-subtle" spacing="lg">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          <div className="relative">
            <img src={keysImg} alt="Happy couple receiving keys to new home" loading="lazy" width={1280} height={896} className="rounded-2xl shadow-elegant aspect-[4/3] object-cover" />
            <Card className="absolute -bottom-6 -right-4 sm:-right-8 p-5 max-w-[260px] bg-card shadow-elegant border-border hidden sm:block">
              <div className="flex items-center gap-2 text-success text-sm font-medium"><CheckCircle2 className="h-4 w-4" /> Pre-approved</div>
              <div className="text-xs text-muted-foreground mt-2">Most pre-approvals returned in <strong className="text-foreground">3–5 business days</strong>.</div>
            </Card>
          </div>
          <div>
            <Eyebrow>Let's talk</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl mt-4 text-balance">Ready when you are.</h2>
            <p className="mt-4 text-muted-foreground">Free, no-obligation consultation. We'll tell you straight what's possible.</p>
            <div className="mt-6"><LeadForm /></div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Index;
