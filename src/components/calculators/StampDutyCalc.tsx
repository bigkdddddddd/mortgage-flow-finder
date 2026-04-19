import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { FieldSlider, ResultCard, CalcDisclaimer } from "./shared";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { estimateStampDuty, fmtMoney, otherClosingCosts } from "@/lib/finance";

export const StampDutyCalc = () => {
  const [price, setPrice] = useState(800_000);
  const [fhb, setFhb] = useState(false);

  const { duty, fees, total } = useMemo(() => {
    const d = estimateStampDuty(price, fhb);
    const f = otherClosingCosts();
    const fTotal = f.transferFee + f.registrationFee + f.conveyancing + f.inspections + f.loanFees;
    return { duty: d, fees: f, total: d + fTotal };
  }, [price, fhb]);

  return (
    <Card className="p-6 sm:p-8 bg-gradient-card shadow-elegant border-border/60">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <FieldSlider id="sd-price" label="Purchase price" value={price} onChange={setPrice} min={100_000} max={3_000_000} step={5_000} prefix="$" />
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-4">
            <div>
              <Label htmlFor="sd-fhb" className="text-sm font-medium">First-home buyer concession</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Eligible buyers may pay reduced or no stamp duty.</p>
            </div>
            <Switch id="sd-fhb" checked={fhb} onCheckedChange={setFhb} />
          </div>
          <div className="rounded-lg border border-border bg-card p-5 space-y-2 text-sm">
            <div className="font-display text-base mb-2">Other estimated costs</div>
            {Object.entries({
              "Transfer fee": fees.transferFee,
              "Registration fee": fees.registrationFee,
              "Conveyancing / legal": fees.conveyancing,
              "Building & pest inspections": fees.inspections,
              "Lender / application fees": fees.loanFees,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between text-foreground/80">
                <span>{k}</span><span className="tabular-nums font-medium">{fmtMoney(v)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <ResultCard label="Estimated stamp duty" value={fmtMoney(duty)} accent />
          <ResultCard label="Total upfront costs" value={fmtMoney(total)} sub="Stamp duty + government & legal fees" />
          <ResultCard label="Suggested cash reserve" value={fmtMoney(total + price * 0.005)} sub="Includes a 0.5% buffer for surprises" />
        </div>
      </div>
      <CalcDisclaimer>Stamp duty estimates are simplified and region-agnostic. Actual duty depends on your state/territory, property type, and concessions you may be eligible for.</CalcDisclaimer>
    </Card>
  );
};
