import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { FieldSlider, ResultCard, CalcDisclaimer } from "./shared";
import { fmtMoney, monthsToPayoff, periodicPayment } from "@/lib/finance";

export const ExtraRepaymentsCalc = () => {
  const [balance, setBalance] = useState(550_000);
  const [rate, setRate] = useState(6.24);
  const [term, setTerm] = useState(28);
  const [extra, setExtra] = useState(300);

  const { yearsSaved, interestSaved } = useMemo(() => {
    const base = periodicPayment(balance, rate, term, "monthly");
    const newPayment = base + extra;
    const baseInterest = base * term * 12 - balance;
    const months = monthsToPayoff(balance, rate, newPayment);
    const newInterest = newPayment * months - balance;
    return {
      yearsSaved: term - months / 12,
      interestSaved: baseInterest - newInterest,
    };
  }, [balance, rate, term, extra]);

  return (
    <Card className="p-6 sm:p-8 bg-gradient-card shadow-elegant border-border/60">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <FieldSlider id="ex-bal" label="Current loan balance" value={balance} onChange={setBalance} min={50_000} max={2_500_000} step={5_000} prefix="$" />
          <FieldSlider id="ex-rate" label="Interest rate" value={rate} onChange={setRate} min={1} max={12} step={0.05} suffix="%" />
          <FieldSlider id="ex-term" label="Remaining loan term" value={term} onChange={setTerm} min={1} max={30} step={1} suffix=" yrs" />
          <FieldSlider id="ex-extra" label="Extra monthly repayment" value={extra} onChange={setExtra} min={0} max={3_000} step={25} prefix="$" tooltip="Amount paid above the minimum required repayment." />
        </div>
        <div className="space-y-3">
          <ResultCard label="Time saved" value={`${Math.max(0, yearsSaved).toFixed(1)} yrs`} accent />
          <ResultCard label="Interest saved" value={fmtMoney(Math.max(0, interestSaved))} sub="Over the life of the loan" />
          <ResultCard label="Extra paid per year" value={fmtMoney(extra * 12)} />
        </div>
      </div>
      <CalcDisclaimer />
    </Card>
  );
};
