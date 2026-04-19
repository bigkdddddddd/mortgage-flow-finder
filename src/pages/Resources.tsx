import { Card } from "@/components/ui/card";
import { Section, PageHero, Eyebrow } from "@/components/layout/Section";
import { blogPosts } from "@/data/site";
import { ArrowRight, BookOpen, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/forms/LeadForm";
import consultImg from "@/assets/consultation.jpg";

const Resources = () => {
  return (
    <>
      <PageHero eyebrow="Resources" title="Plain-English guides and insights." subtitle="Practical articles, checklists, and tools to help you navigate every stage of home finance with confidence." />

      <Section spacing="lg">
        {/* Featured */}
        <Card className="overflow-hidden bg-card border-border/60 grid lg:grid-cols-2 mb-10">
          <div className="aspect-[4/3] lg:aspect-auto">
            <img src={consultImg} alt="Mortgage consultation" loading="lazy" width={1280} height={896} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent font-semibold">
              <BookOpen className="h-4 w-4" /> Featured guide
            </div>
            <h2 className="font-display text-3xl sm:text-4xl mt-3 text-balance">{blogPosts[0].title}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{blogPosts[0].excerpt}</p>
            <div className="mt-5 text-xs text-muted-foreground">{blogPosts[0].date} · {blogPosts[0].readTime}</div>
            <Button variant="default" className="mt-6 w-fit">Read the guide <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogPosts.slice(1).map((p) => (
            <Card key={p.slug} className="p-6 bg-gradient-card border-border/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="text-xs uppercase tracking-wider font-semibold text-accent">{p.category}</div>
              <h3 className="font-display text-lg mt-3 text-balance">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1">{p.excerpt}</p>
              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.date}</span>
                <span>{p.readTime}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-subtle" spacing="lg">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <div>
            <Eyebrow>Free download</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl mt-4 text-balance">The Home-Buyer's Checklist</h2>
            <p className="mt-4 text-muted-foreground">Everything you need to consider before you sign, from deposit savings benchmarks to inspection red flags. 12 pages, beautifully designed.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {[
                { i: FileText, t: "Pre-purchase inspection list" },
                { i: FileText, t: "Document checklist" },
                { i: FileText, t: "Settlement-day playbook" },
                { i: FileText, t: "First 12-month roadmap" },
              ].map((b) => (
                <div key={b.t} className="flex items-center gap-2 text-sm text-foreground/80">
                  <b.i className="h-4 w-4 text-accent" />{b.t}
                </div>
              ))}
            </div>
          </div>
          <Card className="p-6 sm:p-8 bg-card border-border/60 shadow-md">
            <div className="flex items-center gap-2 text-accent font-display"><Download className="h-5 w-5" /> Download the checklist</div>
            <p className="text-sm text-muted-foreground mt-2">Pop in your details and we'll email it instantly.</p>
            <div className="mt-5"><LeadForm variant="inline" defaultTopic="other" title="" subtitle="" /></div>
          </Card>
        </div>
      </Section>
    </>
  );
};

export default Resources;
