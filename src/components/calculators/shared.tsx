import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  format?: (v: number) => string;
  className?: string;
}

export const FieldSlider = ({ id, label, value, onChange, min, max, step, prefix, suffix, tooltip, format, className }: Props) => {
  const display = format ? format(value) : value.toLocaleString();
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-foreground/85">
          {label}
          {tooltip && (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" aria-label="More info"><Info className="h-3.5 w-3.5 text-muted-foreground" /></button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Label>
        <div className="relative">
          {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
          <Input
            id={id}
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              onChange(isNaN(v) ? min : v);
            }}
            className={cn("h-9 w-32 text-right tabular-nums font-medium", prefix && "pl-7", suffix && "pr-7")}
          />
          {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        className="pointer-events-auto"
      />
      <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
        <span>{prefix}{format ? format(min) : min.toLocaleString()}{suffix}</span>
        <span className="font-semibold text-foreground/70">{prefix}{display}{suffix}</span>
        <span>{prefix}{format ? format(max) : max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
};

export const ResultCard = ({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) => (
  <div className={cn(
    "rounded-xl p-5 border",
    accent ? "bg-gradient-hero border-primary/20 text-primary-foreground shadow-elegant" : "bg-card border-border",
  )}>
    <div className={cn("text-xs uppercase tracking-wider font-semibold", accent ? "text-accent" : "text-muted-foreground")}>{label}</div>
    <div className={cn("font-display text-2xl sm:text-3xl mt-2 tabular-nums", accent ? "text-primary-foreground" : "text-foreground")}>{value}</div>
    {sub && <div className={cn("text-xs mt-1", accent ? "text-primary-foreground/70" : "text-muted-foreground")}>{sub}</div>}
  </div>
);

export const CalcDisclaimer = ({ children }: { children?: ReactNode }) => (
  <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
    <strong className="text-foreground/70 font-semibold">Disclaimer:</strong>{" "}
    {children ?? "Results are illustrative only and based on the inputs provided. Actual loan amounts, rates, fees and approvals depend on lender criteria and your full financial circumstances. Speak to one of our brokers for advice tailored to you."}
  </p>
);
