import { Card } from "@/components/ui/card";
import { Section, PageHero } from "@/components/layout/Section";
import { testimonials } from "@/data/site";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Testimonials = () => {
  return (
    <>
      <PageHero eyebrow="Testimonials" title="Real outcomes, in their words." subtitle="A small selection of stories from clients across Australia. We're proud that 93% of our new business comes from referrals." />

      <Section spacing="lg">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Card key={i} className="p-7 bg-gradient-card border-border/60 flex flex-col relative">
              <Quote className="absolute top-5 right-5 h-8 w-8 text-accent/20" />
              <div className="flex">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}</div>
              <p className="mt-4 text-foreground/85 leading-relaxed text-[15px] flex-1">"{t.quote}"</p>
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
      </Section>

      <Section className="bg-gradient-subtle" spacing="md">
        <div className="grid sm:grid-cols-4 gap-6 text-center">
          {[
            { n: "4.9★", l: "Average rating · 380+ reviews" },
            { n: "93%", l: "Business from referrals" },
            { n: "2,400+", l: "Families helped" },
            { n: "$1.4B", l: "Total lending settled" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl text-accent">{s.n}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="md">
        <Card className="p-10 sm:p-14 text-center bg-gradient-hero text-primary-foreground border-primary/30 shadow-elegant">
          <h2 className="font-display text-3xl sm:text-4xl text-balance">Want to be the next success story?</h2>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Button asChild variant="hero" size="lg"><Link to="/book">Book a consultation</Link></Button>
            <Button asChild variant="hero-outline" size="lg"><Link to="/calculators">Try our calculators</Link></Button>
          </div>
        </Card>
      </Section>
    </>
  );
};

export default Testimonials;
