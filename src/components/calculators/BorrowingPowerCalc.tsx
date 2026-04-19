import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { FieldSlider, ResultCard, CalcDisclaimer } from "./shared";
import { estimateBorrowingPower, fmtMoney, periodicPayment } from "@/lib/finance";

export const BorrowingPowerCalc = () => {
  const [income, setIncome] = useState(95_000);
  const [partner, setPartner] = useState(70_000);
  const [expenses, setExpenses] = useState(2_800);
  const [debts, setDebts] = useState(450);
  const [dependents, setDependents] = useState(0);
  const [rate, setRate] = useState(6.24);
  const [term, setTerm] = useState(30);

  const borrow = useMemo(() => estimateBorrowingPower({
    grossIncome: income, partnerIncome: partner, monthlyExpenses: expenses,
    existingDebtRepayments: debts, dependents, ratePct: rate, termYears: term,
  }), [income, partner, expenses, debts, dependents, rate, term]);

  const repayment = periodicPayment(borrow, rate, term, "monthly");

  return (
    <Card className="p-6 sm:p-8 bg-gradient-card shadow-elegant border-border/60">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <FieldSlider id="bp-income" label="Your gross annual income" value={income} onChange={setIncome} min={20_000} max={500_000} step={1_000} prefix="$" tooltip="Before-tax salary including regular bonuses." />
          <FieldSlider id="bp-partner" label="Partner gross annual income" value={partner} onChange={setPartner} min={0} max={500_000} step={1_000} prefix="$" />
          <FieldSlider id="bp-expenses" label="Monthly living expenses" value={expenses} onChange={setExpenses} min={500} max={15_000} step={50} prefix="$" tooltip="Groceries, utilities, transport, insurance, lifestyle." />
          <FieldSlider id="bp-debts" label="Existing monthly debt repayments" value={debts} onChange={setDebts} min={0} max={10_000} step={50} prefix="$" tooltip="Credit cards, personal loans, HECS, car finance." />
          <FieldSlider id="bp-deps" label="Number of dependents" value={dependents} onChange={setDependents} min={0} max={6} step={1} />
          <FieldSlider id="bp-rate" label="Indicative interest rate" value={rate} onChange={setRate} min={3} max={12} step={0.05} suffix="%" tooltip="A 3% serviceability buffer is added by lenders." />
          <FieldSlider id="bp-term" label="Loan term" value={term} onChange={setTerm} min={10} max={30} step={1} suffix=" yrs" />
        </div>
        <div className="space-y-3">
          <ResultCard label="Estimated borrowing power" value={fmtMoney(borrow)} accent />
          <ResultCard label="Indicative monthly repayment" value={fmtMoney(repayment)} sub={`Over ${term} years at ${rate.toFixed(2)}%`} />
          <ResultCard label="Combined gross income" value={fmtMoney(income + partner)} />
        </div>
      </div>
      <CalcDisclaimer />
    </Card>
  );
};
