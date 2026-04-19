import { Card } from "@/components/ui/card";
import { Section, PageHero, Eyebrow } from "@/components/layout/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Calculator as CalcIcon, PiggyBank, Receipt, Zap, GitCompare, Banknote } from "lucide-react";
import { BorrowingPowerCalc } from "@/components/calculators/BorrowingPowerCalc";
import { RepaymentCalc } from "@/components/calculators/RepaymentCalc";
import { RefinanceSavingsCalc } from "@/components/calculators/RefinanceSavingsCalc";
import { StampDutyCalc } from "@/components/calculators/StampDutyCalc";
import { ExtraRepaymentsCalc } from "@/components/calculators/ExtraRepaymentsCalc";
import { LoanComparisonCalc } from "@/components/calculators/LoanComparisonCalc";
import { OffsetCalc } from "@/components/calculators/OffsetCalc";
import { LeadForm } from "@/components/forms/LeadForm";

const tabs = [
  { value: "borrowing-power", label: "Borrowing", icon: Wallet, title: "Borrowing power", desc: "Estimate how much you could borrow based on income, expenses, debts and dependents — using a typical lender serviceability buffer.", Component: BorrowingPowerCalc },
  { value: "repayments", label: "Repayments", icon: CalcIcon, title: "Mortgage repayments", desc: "Calculate weekly, fortnightly, or monthly repayments and total interest across the life of your loan.", Component: RepaymentCalc },
  { value: "refinance", label: "Refinance", icon: PiggyBank, title: "Refinance savings", desc: "See how much you could save by switching lenders. Includes switching costs in the net result.", Component: RefinanceSavingsCalc },
  { value: "stamp-duty", label: "Closing costs", icon: Receipt, title: "Stamp duty & closing costs", desc: "Estimate stamp duty along with conveyancing, registration and inspection fees you'll need at settlement.", Component: StampDutyCalc },
  { value: "extra", label: "Extra repayments", icon: Zap, title: "Extra repayments", desc: "Discover how small extra contributions can shave years off your loan and tens of thousands in interest.", Component: ExtraRepaymentsCalc },
  { value: "compare", label: "Loan compare", icon: GitCompare, title: "Loan comparison", desc: "Compare two loans side-by-side, factoring in headline rate and ongoing package fees.", Component: LoanComparisonCalc },
  { value: "offset", label: "Offset", icon: Banknote, title: "Offset savings", desc: "Estimate the interest you could save by holding savings in an offset account against your loan.", Component: OffsetCalc },
];

const Calculators = () => {
  return (
    <>
      <PageHero eyebrow="Calculators" title="Numbers you can plan around." subtitle="Seven professional-grade calculators to help you model decisions before you make them. Always speak to a broker for personalised advice." />

      <Section spacing="lg">
        <Tabs defaultValue="borrowing-power" className="w-full">
          <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 mb-8">
            <TabsList className="inline-flex h-auto p-1.5 bg-secondary">
              {tabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 px-4 py-2.5">
                  <t.icon className="h-4 w-4" />{t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value} className="mt-0 animate-fade-in">
              <div className="mb-6 max-w-2xl">
                <h2 className="font-display text-3xl text-balance">{t.title}</h2>
                <p className="mt-3 text-muted-foreground">{t.desc}</p>
              </div>
              <t.Component />
            </TabsContent>
          ))}
        </Tabs>
      </Section>

      <Section className="bg-gradient-subtle" spacing="md">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <div>
            <Eyebrow>Want it tailored?</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl mt-4 text-balance">Get a personalised number in 24 hours.</h2>
            <p className="mt-4 text-muted-foreground">Our calculators are a great starting point — but lender pricing, policy and your specific situation all change the answer. Send us your details and we'll come back with a written, tailored estimate.</p>
            <Card className="p-5 mt-6 bg-card border-border/60">
              <div className="text-xs uppercase tracking-wider text-accent font-semibold">Did you know?</div>
              <p className="text-sm mt-2 leading-relaxed text-foreground/85">Two lenders quoting the "same" rate can result in repayment differences of $4,000+ a year once fees, offsets and cashbacks are factored in.</p>
            </Card>
          </div>
          <LeadForm title="Get a tailored estimate" subtitle="A broker will follow up with personalised numbers." />
        </div>
      </Section>
    </>
  );
};

export default Calculators;
