import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { FieldSlider, ResultCard, CalcDisclaimer } from "./shared";
import { fmtMoney, fmtMoneyDecimal, periodicPayment } from "@/lib/finance";

export const RefinanceSavingsCalc = () => {
  const [balance, setBalance] = useState(520_000);
  const [currentRate, setCurrentRate] = useState(6.79);
  const [newRate, setNewRate] = useState(5.69);
  const [remaining, setRemaining] = useState(25);
  const [switchCost, setSwitchCost] = useState(750);

  const { monthlySavings, totalSavings, payNow, payNew } = useMemo(() => {
    const a = periodicPayment(balance, currentRate, remaining, "monthly");
    const b = periodicPayment(balance, newRate, remaining, "monthly");
    const monthly = a - b;
    const total = monthly * remaining * 12 - switchCost;
    return { monthlySavings: monthly, totalSavings: total, payNow: a, payNew: b };
  }, [balance, currentRate, newRate, remaining, switchCost]);

  return (
    <Card className="p-6 sm:p-8 bg-gradient-card shadow-elegant border-border/60">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <FieldSlider id="rf-bal" label="Current loan balance" value={balance} onChange={setBalance} min={50_000} max={2_500_000} step={5_000} prefix="$" />
          <FieldSlider id="rf-cur" label="Current interest rate" value={currentRate} onChange={setCurrentRate} min={1} max={12} step={0.05} suffix="%" />
          <FieldSlider id="rf-new" label="New interest rate" value={newRate} onChange={setNewRate} min={1} max={12} step={0.05} suffix="%" tooltip="The rate offered by the new lender." />
          <FieldSlider id="rf-rem" label="Remaining loan term" value={remaining} onChange={setRemaining} min={1} max={30} step={1} suffix=" yrs" />
          <FieldSlider id="rf-cost" label="Estimated switching costs" value={switchCost} onChange={setSwitchCost} min={0} max={5_000} step={50} prefix="$" tooltip="Discharge, application, government and legal fees combined." />
        </div>
        <div className="space-y-3">
          <ResultCard label="Monthly saving" value={fmtMoneyDecimal(monthlySavings)} accent />
          <ResultCard label="Net savings (after costs)" value={fmtMoney(totalSavings)} sub={`Over ${remaining} years`} />
          <ResultCard label="Current → new repayment" value={`${fmtMoney(payNow)} → ${fmtMoney(payNew)}`} />
        </div>
      </div>
      <CalcDisclaimer />
    </Card>
  );
};
