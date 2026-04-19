import { Card } from "@/components/ui/card";
import { Section, PageHero, Eyebrow } from "@/components/layout/Section";
import { services } from "@/data/site";
import { Home, Repeat, TrendingUp, HardHat, Building2, Layers, Briefcase, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LeadForm } from "@/components/forms/LeadForm";

const iconMap = { Home, Repeat, TrendingUp, HardHat, Building2, Layers, Briefcase } as const;

const Services = () => {
  return (
    <>
      <PageHero eyebrow="Services" title="Specialist lending across every life stage." subtitle="Whether you're buying your first home, growing a portfolio, or restructuring debt — we have a solution and a lender for it." />

      <Section spacing="lg">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap];
            return (
              <Card key={s.slug} id={s.slug} className="p-7 sm:p-8 bg-gradient-card border-border/60 hover:shadow-md transition-all">
                <div className="flex items-start gap-5">
                  <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl">{s.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{s.blurb}</p>
                    <ul className="mt-5 grid sm:grid-cols-2 gap-2.5">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-foreground/85">
                          <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />{p}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="ghost" size="sm" className="mt-5 -ml-3"><Link to="/book">Book a chat <ArrowRight className="h-3 w-3" /></Link></Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section className="bg-gradient-subtle" spacing="lg">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <div>
            <Eyebrow>Not sure where you fit?</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl mt-4 text-balance">Tell us your situation. We'll point you in the right direction.</h2>
            <p className="mt-5 text-muted-foreground">Many of our clients arrive unsure which loan type suits them best. A quick conversation usually clears it up — and there's no obligation to proceed.</p>
          </div>
          <LeadForm title="Quick enquiry" subtitle="A broker will call within one business day." />
        </div>
      </Section>
    </>
  );
};

export default Services;
