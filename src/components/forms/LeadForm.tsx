import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone").max(20),
  topic: z.string().min(1, "Please choose a topic"),
  message: z.string().trim().max(800).optional().or(z.literal("")),
});

interface Props {
  variant?: "card" | "inline";
  defaultTopic?: string;
  title?: string;
  subtitle?: string;
}

export const LeadForm = ({ variant = "card", defaultTopic, title = "Request a callback", subtitle = "A friendly broker will be in touch within one business day." }: Props) => {
  const [data, setData] = useState({ name: "", email: "", phone: "", topic: defaultTopic ?? "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parse = schema.safeParse(data);
    if (!parse.success) {
      const fieldErrors: Record<string, string> = {};
      parse.error.issues.forEach((i) => { fieldErrors[i.path[0] as string] = i.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const html = `
        <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:auto;padding:24px;color:#1a1a1a;">
          <h1 style="font-size:22px;margin:0 0 12px;">Thanks for reaching out, ${data.name.split(" ")[0]} 👋</h1>
          <p style="color:#555;line-height:1.5;">We've received your request and a Meridian Mortgage broker will be in touch within one business day.</p>
          <div style="background:#f7f4ee;border:1px solid #e6dfd0;border-radius:12px;padding:16px;margin:16px 0;">
            <div><b>Topic:</b> ${data.topic}</div>
            ${data.message ? `<div style="margin-top:8px;"><b>Your message:</b><br/>${data.message.replace(/</g, "&lt;")}</div>` : ""}
          </div>
          <p style="color:#888;font-size:12px;margin-top:24px;">— The Meridian Mortgage team</p>
        </div>`;
      supabase.functions.invoke("send-email", {
        body: { to: data.email, subject: "We received your request — Meridian Mortgage", html },
      }).catch((e) => console.warn("email failed", e));
    } catch (e) { console.warn(e); }

    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
    toast({ title: "Request received", description: "We'll be in touch within one business day. Check your email for confirmation." });
  };

  if (submitted) {
    return (
      <div className={cn(
        "text-center",
        variant === "card" ? "rounded-2xl p-8 bg-gradient-card border border-border shadow-md" : "py-8",
      )}>
        <div className="mx-auto h-14 w-14 rounded-full bg-success/10 text-success flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="font-display text-xl mt-4">Thank you, {data.name.split(" ")[0]}!</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          Your request is in our inbox. Expect a call from a Meridian broker shortly — usually within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn(
      variant === "card" && "rounded-2xl p-6 sm:p-8 bg-gradient-card border border-border shadow-md",
      "space-y-4",
    )}>
      {variant === "card" && (
        <div className="mb-2">
          <h3 className="font-display text-xl">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lf-name">Full name</Label>
          <Input id="lf-name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Jane Doe" className="mt-1.5" />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="lf-phone">Phone</Label>
          <Input id="lf-phone" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="04xx xxx xxx" className="mt-1.5" />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="lf-email">Email</Label>
        <Input id="lf-email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="you@example.com" className="mt-1.5" />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="lf-topic">What can we help with?</Label>
        <Select value={data.topic} onValueChange={(v) => setData({ ...data, topic: v })}>
          <SelectTrigger id="lf-topic" className="mt-1.5"><SelectValue placeholder="Choose a topic" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="first-home">Buying my first home</SelectItem>
            <SelectItem value="next-home">Buying my next home</SelectItem>
            <SelectItem value="refinance">Refinancing my loan</SelectItem>
            <SelectItem value="investment">Investment property</SelectItem>
            <SelectItem value="construction">Construction loan</SelectItem>
            <SelectItem value="commercial">Commercial finance</SelectItem>
            <SelectItem value="self-employed">Self-employed lending</SelectItem>
            <SelectItem value="other">Something else</SelectItem>
          </SelectContent>
        </Select>
        {errors.topic && <p className="text-xs text-destructive mt-1">{errors.topic}</p>}
      </div>
      <div>
        <Label htmlFor="lf-msg">Message (optional)</Label>
        <Textarea id="lf-msg" rows={3} maxLength={800} value={data.message} onChange={(e) => setData({ ...data, message: e.target.value })} placeholder="Tell us a little about your situation…" className="mt-1.5 resize-none" />
      </div>
      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Sending…" : "Request callback"}
      </Button>
      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        By submitting, you agree to our privacy policy. We'll never share your details.
      </p>
    </form>
  );
};
