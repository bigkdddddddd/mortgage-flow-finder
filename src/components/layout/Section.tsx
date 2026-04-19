import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  width?: "tight" | "wide";
  spacing?: "sm" | "md" | "lg";
}

export const Section = ({ children, className, id, width = "wide", spacing = "lg" }: SectionProps) => {
  const padding = spacing === "sm" ? "py-12 sm:py-16" : spacing === "md" ? "py-16 sm:py-20" : "py-20 sm:py-28";
  return (
    <section id={id} className={cn(padding, className)}>
      <div className={width === "tight" ? "container-tight" : "container-wide"}>{children}</div>
    </section>
  );
};

interface EyebrowProps { children: ReactNode; className?: string; }
export const Eyebrow = ({ children, className }: EyebrowProps) => (
  <div className={cn("inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-accent", className)}>
    <span className="h-px w-8 bg-accent" />
    {children}
  </div>
);

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}
export const PageHero = ({ eyebrow, title, subtitle, align = "center" }: PageHeroProps) => (
  <section className="bg-gradient-hero text-primary-foreground pt-12 pb-20 sm:pt-16 sm:pb-28 relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
    <div className={cn("container-tight relative", align === "center" && "text-center")}>
      {eyebrow && <Eyebrow className={cn(align === "center" && "justify-center")}>{eyebrow}</Eyebrow>}
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium mt-4 text-balance">{title}</h1>
      {subtitle && <p className={cn("mt-5 text-lg text-primary-foreground/75 max-w-2xl text-pretty leading-relaxed", align === "center" && "mx-auto")}>{subtitle}</p>}
    </div>
  </section>
);
