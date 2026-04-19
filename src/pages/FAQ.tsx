import { Section, PageHero, Eyebrow } from "@/components/layout/Section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/data/site";
import { Card } from "@/components/ui/card";
import { LeadForm } from "@/components/forms/LeadForm";

const FAQ = () => {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Answers to the things people ask most." subtitle="Can't find what you need? Send us a question and a broker will reply personally." />

      <Section spacing="lg">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-start">
          <Card className="p-2 sm:p-4 bg-card border-border/60">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`f-${i}`} className="border-border last:border-0">
                  <AccordionTrigger className="text-left font-display text-base sm:text-lg px-4 py-5 hover:no-underline hover:text-accent">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-5 text-foreground/75 leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
          <div className="lg:sticky lg:top-24">
            <Eyebrow>Still have questions?</Eyebrow>
            <h2 className="font-display text-2xl mt-4 mb-4">Ask us directly.</h2>
            <LeadForm title="Send us a question" subtitle="A broker will reply personally — usually within a few hours." />
          </div>
        </div>
      </Section>
    </>
  );
};

export default FAQ;
