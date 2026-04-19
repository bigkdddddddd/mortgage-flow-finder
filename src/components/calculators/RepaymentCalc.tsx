import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { FieldSlider, ResultCard, CalcDisclaimer } from "./shared";
import { fmtMoney, fmtMoneyDecimal, periodicPayment } from "@/lib/finance";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const RepaymentCalc = () => {
  const [amount, setAmount] = useState(650_000);
  const [rate, setRate] = useState(6.24);
  const [term, setTerm] = useState(30);
  const [freq, setFreq] = useState<"monthly" | "fortnightly" | "weekly">("monthly");

  const payment = useMemo(() => periodicPayment(amount, rate, term, freq), [amount, rate, term, freq]);
  const totalPayments = freq === "weekly" ? term * 52 : freq === "fortnightly" ? term * 26 : term * 12;
  const totalPaid = payment * totalPayments;
  const totalInterest = totalPaid - amount;

  return (
    <Card className="p-6 sm:p-8 bg-gradient-card shadow-elegant border-border/60">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <FieldSlider id="rep-amt" label="Loan amount" value={amount} onChange={setAmount} min={50_000} max={3_000_000} step={5_000} prefix="$" />
          <FieldSlider id="rep-rate" label="Interest rate" value={rate} onChange={setRate} min={1} max={12} step={0.05} suffix="%" />
          <FieldSlider id="rep-term" label="Loan term" value={term} onChange={setTerm} min={5} max={30} step={1} suffix=" yrs" />
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground/85">Repayment frequency</div>
            <Tabs value={freq} onValueChange={(v) => setFreq(v as typeof freq)}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="fortnightly">Fortnightly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="space-y-3">
          <ResultCard label={`${freq[0].toUpperCase()}${freq.slice(1)} repayment`} value={fmtMoneyDecimal(payment)} accent />
          <ResultCard label="Total interest" value={fmtMoney(totalInterest)} sub={`Over ${term} years`} />
          <ResultCard label="Total amount repaid" value={fmtMoney(totalPaid)} />
        </div>
      </div>
      <CalcDisclaimer />
    </Card>
  );
};
