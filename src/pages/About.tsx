import { Award, BookOpen, Heart, Shield, Target, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section, PageHero, Eyebrow } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { lenderLogos } from "@/data/site";
import brokerImg from "@/assets/broker-portrait.jpg";

const About = () => {
  return (
    <>
      <PageHero eyebrow="About Meridian" title="Independent brokers, with skin in the game." subtitle="Founded in 2011, Meridian Mortgage helps Australians make smarter home finance decisions — with advice that's transparent, modern, and genuinely on their side." />

      <Section spacing="lg">
        <div className="grid lg:grid-cols-[420px_1fr] gap-12 items-start">
          <div className="relative">
            <div className="absolute -inset-3 bg-accent/15 rounded-2xl blur-xl" />
            <img src={brokerImg} alt="Meridian principal broker portrait" loading="lazy" width={1024} height={1024} className="relative rounded-2xl shadow-elegant aspect-square object-cover w-full" />
            <Card className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-5 py-3 bg-card shadow-elegant border-border whitespace-nowrap">
              <div className="text-xs uppercase tracking-wider text-accent font-semibold">Principal Broker</div>
              <div className="font-display text-base mt-0.5">Aarav Mehta</div>
            </Card>
          </div>
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl mt-4 text-balance">Built on a simple idea: clients first, always.</h2>
            <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
              <p>Aarav Mehta founded Meridian after a decade inside major banks, frustrated by sales targets that didn't always align with client outcomes. He set out to build a brokerage where the recommendation always starts with what's right for the borrower.</p>
              <p>Today our team has helped over 2,400 Australian families and investors secure more than $1.4 billion in lending — with a 4.9-star average rating and 93% of new business coming from referrals.</p>
              <p>We're modern, paperless, and proudly independent. We're also human: we'll pick up the phone, explain the fine print, and remember your name when you call back next year.</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { n: "13+", l: "Years experience" },
                { n: "$1.4B", l: "Lent to clients" },
                { n: "2,400+", l: "Families helped" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-border p-5 bg-card">
                  <div className="font-display text-2xl text-accent">{s.n}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-subtle" spacing="lg">
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow className="justify-center">Mission & values</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 text-balance">What we stand for.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {[
            { i: Heart, t: "Client-first advice", d: "Best-interests duty isn't a checkbox — it's how every recommendation begins." },
            { i: Shield, t: "Radical transparency", d: "Commission disclosure in writing, every time. No hidden agendas, ever." },
            { i: Target, t: "Outcome-focused", d: "We measure ourselves on the result you achieve, not the loan we settle." },
            { i: BookOpen, t: "Always learning", d: "Lender policy changes daily. We invest in research so you don't have to." },
          ].map((v) => (
            <Card key={v.t} className="p-6 bg-card border-border/60">
              <div className="h-11 w-11 rounded-lg bg-accent-soft text-accent-foreground flex items-center justify-center"><v.i className="h-5 w-5" /></div>
              <div className="font-display text-lg mt-5">{v.t}</div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{v.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section spacing="lg">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Eyebrow>Accreditations</Eyebrow>
            <h2 className="font-display text-3xl mt-4 text-balance">Qualified, accredited, accountable.</h2>
            <ul className="mt-7 space-y-4">
              {[
                { i: Award, t: "MFAA Member", d: "Mortgage & Finance Association of Australia · #M-294112" },
                { i: Shield, t: "ACL #389328", d: "Australian Credit Licence — fully regulated under NCCP Act" },
                { i: Users, t: "AFCA Member #82110", d: "Australian Financial Complaints Authority external dispute resolution" },
                { i: BookOpen, t: "Diploma of Finance & Mortgage Broking", d: "Plus annual CPD across all team members" },
              ].map((a) => (
                <li key={a.t} className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0"><a.i className="h-5 w-5" /></div>
                  <div>
                    <div className="font-medium">{a.t}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{a.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Lender panel</Eyebrow>
            <h2 className="font-display text-3xl mt-4 text-balance">40+ lenders. One conversation.</h2>
            <p className="mt-4 text-muted-foreground">From the big four to specialist non-bank lenders, our panel is broad enough to find the right fit for almost any situation.</p>
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {lenderLogos.map((l) => (
                <div key={l} className="rounded-lg border border-border bg-card p-3 text-center text-sm font-display text-foreground/70">{l}</div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="md">
        <Card className="p-10 sm:p-14 text-center bg-gradient-hero text-primary-foreground border-primary/30 shadow-elegant">
          <h2 className="font-display text-3xl sm:text-4xl text-balance">Ready to meet your broker?</h2>
          <p className="mt-4 text-primary-foreground/75 max-w-xl mx-auto">A 30-minute discovery call is the easiest way to find out what's possible.</p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Button asChild variant="hero" size="lg"><Link to="/book">Book a consultation</Link></Button>
            <Button asChild variant="hero-outline" size="lg"><Link to="/contact">Send a message</Link></Button>
          </div>
        </Card>
      </Section>
    </>
  );
};

export default About;
