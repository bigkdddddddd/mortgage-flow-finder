import { Card } from "@/components/ui/card";
import { Section, PageHero, Eyebrow } from "@/components/layout/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { Mail, Phone, MapPin, Clock, Linkedin, Facebook, Instagram } from "lucide-react";

const Contact = () => {
  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you." subtitle="Send a message, request a callback, or drop into our Sydney office." />

      <Section spacing="lg">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          <div>
            <Eyebrow>Get in touch</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl mt-4 text-balance">Speak directly with a broker.</h2>
            <p className="mt-4 text-muted-foreground">No call centres. No transfers. The person who answers is the person who'll handle your loan.</p>

            <div className="mt-8 space-y-5">
              {[
                { i: Phone, t: "Phone", d: "1300 000 000", h: "tel:1300000000" },
                { i: Mail, t: "Email", d: "hello@meridianmortgage.co", h: "mailto:hello@meridianmortgage.co" },
                { i: MapPin, t: "Office", d: "Level 12, 88 Harbour St, Sydney NSW 2000" },
                { i: Clock, t: "Hours", d: "Mon–Fri 8:30am – 6:00pm · Sat by appointment" },
              ].map((c) => (
                <a key={c.t} href={c.h} className="flex items-start gap-4 group">
                  <div className="h-11 w-11 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <c.i className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.t}</div>
                    <div className="font-medium mt-0.5">{c.d}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              {[Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social" className="h-10 w-10 rounded-md border border-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Map placeholder */}
            <Card className="mt-8 overflow-hidden border-border/60">
              <div className="relative h-56 bg-gradient-to-br from-primary/90 to-teal/80">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <MapPin className="h-8 w-8 mx-auto text-accent" />
                    <div className="font-display text-lg mt-2">88 Harbour Street</div>
                    <div className="text-sm text-primary-foreground/70">Sydney CBD · Map placeholder</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <LeadForm title="Send a message" subtitle="A broker will respond within one business day." />
        </div>
      </Section>
    </>
  );
};

export default Contact;
