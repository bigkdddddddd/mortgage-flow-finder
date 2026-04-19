import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { FieldSlider, ResultCard, CalcDisclaimer } from "./shared";
import { fmtMoney, periodicPayment } from "@/lib/finance";

export const OffsetCalc = () => {
  const [balance, setBalance] = useState(540_000);
  const [rate, setRate] = useState(6.24);
  const [term, setTerm] = useState(27);
  const [offset, setOffset] = useState(45_000);

  const { interestSaved, yearsSaved } = useMemo(() => {
    const basePay = periodicPayment(balance, rate, term, "monthly");
    const baseInterest = basePay * term * 12 - balance;
    // Offset reduces principal balance interest is calculated on.
    // Keep same payment; calculate new payoff time on the offset-adjusted interest charge each month.
    let bal = balance;
    let months = 0;
    const r = rate / 100 / 12;
    while (bal > 0 && months < term * 12) {
      const interest = Math.max(0, bal - offset) * r;
      const principal = basePay - interest;
      bal -= principal;
      months++;
      if (principal <= 0) break;
    }
    const newInterest = basePay * months - balance;
    return {
      interestSaved: Math.max(0, baseInterest - newInterest),
      yearsSaved: Math.max(0, term - months / 12),
    };
  }, [balance, rate, term, offset]);

  return (
    <Card className="p-6 sm:p-8 bg-gradient-card shadow-elegant border-border/60">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <FieldSlider id="off-bal" label="Loan balance" value={balance} onChange={setBalance} min={50_000} max={2_500_000} step={5_000} prefix="$" />
          <FieldSlider id="off-rate" label="Interest rate" value={rate} onChange={setRate} min={1} max={12} step={0.05} suffix="%" />
          <FieldSlider id="off-term" label="Remaining term" value={term} onChange={setTerm} min={1} max={30} step={1} suffix=" yrs" />
          <FieldSlider id="off-bal2" label="Average offset balance" value={offset} onChange={setOffset} min={0} max={500_000} step={1_000} prefix="$" tooltip="Funds held in your offset account that reduce interest." />
        </div>
        <div className="space-y-3">
          <ResultCard label="Interest saved" value={fmtMoney(interestSaved)} accent />
          <ResultCard label="Time saved" value={`${yearsSaved.toFixed(1)} yrs`} sub="Loan paid off sooner" />
          <ResultCard label="Effective rate impact" value={`~ ${((offset / balance) * rate).toFixed(2)}%`} sub="Reduction in interest charge" />
        </div>
      </div>
      <CalcDisclaimer />
    </Card>
  );
};
