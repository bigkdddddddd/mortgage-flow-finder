import { Card } from "@/components/ui/card";
import { Section, PageHero } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Testimonials = () => {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Client stories coming soon."
        subtitle="KM Financing is focused on building real client outcomes across home loans, car loans, and asset finance. As new client feedback comes in, this page will be updated with genuine stories."
      />

      <Section spacing="md">
        <Card className="p-10 sm:p-14 text-center bg-gradient-hero text-primary-foreground border-primary/30 shadow-elegant">
          <h2 className="font-display text-3xl sm:text-4xl text-balance">Ready to speak with a broker?</h2>
          <p className="mt-4 text-primary-foreground/75 max-w-xl mx-auto">
            Book a free consultation or use the calculators to get a starting point before applying.
          </p>
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
