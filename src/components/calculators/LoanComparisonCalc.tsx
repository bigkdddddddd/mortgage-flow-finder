import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { FieldSlider, ResultCard, CalcDisclaimer } from "./shared";
import { fmtMoney, fmtMoneyDecimal, periodicPayment } from "@/lib/finance";

export const LoanComparisonCalc = () => {
  const [amount, setAmount] = useState(620_000);
  const [term, setTerm] = useState(30);

  const [rateA, setRateA] = useState(6.39);
  const [feesA, setFeesA] = useState(395);

  const [rateB, setRateB] = useState(5.89);
  const [feesB, setFeesB] = useState(0);

  const calc = (rate: number, fees: number) => {
    const pay = periodicPayment(amount, rate, term, "monthly");
    const total = pay * term * 12 + fees * term;
    return { pay, total, interest: total - amount };
  };

  const a = useMemo(() => calc(rateA, feesA), [amount, term, rateA, feesA]);
  const b = useMemo(() => calc(rateB, feesB), [amount, term, rateB, feesB]);
  const winnerSaves = Math.abs(a.total - b.total);
  const winner = a.total < b.total ? "A" : "B";

  return (
    <Card className="p-6 sm:p-8 bg-gradient-card shadow-elegant border-border/60">
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldSlider id="cmp-amt" label="Loan amount" value={amount} onChange={setAmount} min={50_000} max={3_000_000} step={5_000} prefix="$" />
          <FieldSlider id="cmp-term" label="Loan term" value={term} onChange={setTerm} min={5} max={30} step={1} suffix=" yrs" />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="font-display text-lg flex items-center justify-between">Loan A <span className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Option 1</span></div>
            <FieldSlider id="cmp-ra" label="Interest rate" value={rateA} onChange={setRateA} min={1} max={12} step={0.05} suffix="%" />
            <FieldSlider id="cmp-fa" label="Annual package fee" value={feesA} onChange={setFeesA} min={0} max={1_000} step={5} prefix="$" />
            <div className="pt-3 border-t border-border space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Monthly payment</span><span className="font-semibold tabular-nums">{fmtMoneyDecimal(a.pay)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total cost</span><span className="font-semibold tabular-nums">{fmtMoney(a.total)}</span></div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="font-display text-lg flex items-center justify-between">Loan B <span className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Option 2</span></div>
            <FieldSlider id="cmp-rb" label="Interest rate" value={rateB} onChange={setRateB} min={1} max={12} step={0.05} suffix="%" />
            <FieldSlider id="cmp-fb" label="Annual package fee" value={feesB} onChange={setFeesB} min={0} max={1_000} step={5} prefix="$" />
            <div className="pt-3 border-t border-border space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Monthly payment</span><span className="font-semibold tabular-nums">{fmtMoneyDecimal(b.pay)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total cost</span><span className="font-semibold tabular-nums">{fmtMoney(b.total)}</span></div>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <ResultCard label="Lower-cost loan" value={`Loan ${winner}`} accent />
          <ResultCard label={`Total saving with Loan ${winner}`} value={fmtMoney(winnerSaves)} sub={`Over ${term} years including fees`} />
        </div>
      </div>
      <CalcDisclaimer />
    </Card>
  );
};
