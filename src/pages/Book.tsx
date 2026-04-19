import { useMemo, useState } from "react";
import { z } from "zod";
import { format, addDays, isWeekend, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Section, PageHero } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, CheckCircle2, ChevronLeft, Clock, Loader2, MapPin, Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const TIME_SLOTS = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone").max(20),
  purpose: z.string().min(1, "Select a loan purpose"),
  amount: z.string().min(1, "Enter an approximate amount"),
  notes: z.string().max(800).optional().or(z.literal("")),
});

type Mode = "phone" | "video" | "in-person";

const Book = () => {
  const [step, setStep] = useState<1 | 2 | 3 | "done">(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [mode, setMode] = useState<Mode>("video");
  const [data, setData] = useState({ name: "", email: "", phone: "", purpose: "", amount: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const minDate = useMemo(() => addDays(startOfDay(new Date()), 1), []);

  const handleSubmit = async () => {
    const parse = schema.safeParse(data);
    if (!parse.success) {
      const fe: Record<string, string> = {};
      parse.error.issues.forEach((i) => { fe[i.path[0] as string] = i.message; });
      setErrors(fe);
      return;
    }
    setErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    setSubmitting(false);
    setStep("done");
    toast({ title: "Appointment confirmed", description: `${date && format(date, "EEE d MMM")} at ${time}` });
  };

  if (step === "done") {
    return (
      <>
        <PageHero eyebrow="Confirmed" title="Your appointment is booked." subtitle="A confirmation email is on its way." />
        <Section spacing="md">
          <Card className="max-w-xl mx-auto p-8 sm:p-10 text-center bg-gradient-card border-border/60 shadow-elegant">
            <div className="mx-auto h-16 w-16 rounded-full bg-success/10 text-success flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl mt-5">Thanks, {data.name.split(" ")[0]}!</h2>
            <p className="text-muted-foreground mt-2">We've sent a confirmation to <strong className="text-foreground">{data.email}</strong>.</p>
            <div className="mt-6 grid sm:grid-cols-3 gap-3 text-left">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Date</div>
                <div className="font-display text-base mt-1">{date && format(date, "EEE d MMM")}</div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Time</div>
                <div className="font-display text-base mt-1">{time}</div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Mode</div>
                <div className="font-display text-base mt-1 capitalize">{mode.replace("-", " ")}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6">Want to prepare? Have payslips, ID, and a recent bank statement handy. We'll email a checklist too.</p>
            <Button asChild variant="default" className="mt-6"><a href="/">Back to home</a></Button>
          </Card>
        </Section>
      </>
    );
  }

  const stepLabel = step === 1 ? "Date & time" : step === 2 ? "Meeting mode" : "Your details";

  return (
    <>
      <PageHero eyebrow="Book a consultation" title="A 30-minute call. Zero obligation." subtitle="Pick a time that suits — phone, video, or in our Sydney office." />

      <Section spacing="lg">
        <div className="max-w-4xl mx-auto">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mb-8 text-sm">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center font-semibold transition-colors",
                  n === step ? "bg-accent text-accent-foreground" : n < (step as number) ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground",
                )}>
                  {n < (step as number) ? <CheckCircle2 className="h-4 w-4" /> : n}
                </div>
                {n < 3 && <div className={cn("h-px w-12", n < (step as number) ? "bg-success" : "bg-border")} />}
              </div>
            ))}
          </div>

          <Card className="p-6 sm:p-10 bg-gradient-card border-border/60 shadow-elegant">
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Step {step} of 3</div>
            <h2 className="font-display text-2xl sm:text-3xl mt-2">{stepLabel}</h2>

            {step === 1 && (
              <div className="mt-6 grid md:grid-cols-[auto_1fr] gap-8">
                <div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < minDate || isWeekend(d)}
                    initialFocus
                    className="p-3 pointer-events-auto rounded-lg border border-border bg-card"
                  />
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5"><CalendarIcon className="h-3.5 w-3.5" /> Mon–Fri only · AEST</p>
                </div>
                <div>
                  <div className="text-sm font-medium mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-accent" />{date ? format(date, "EEEE, d MMMM") : "Choose a date first"}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        disabled={!date}
                        onClick={() => setTime(t)}
                        className={cn(
                          "h-10 rounded-md border text-sm font-medium transition-colors",
                          !date && "opacity-40 cursor-not-allowed",
                          time === t ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card hover:border-accent/50 hover:bg-accent-soft/40",
                        )}
                      >{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-6">
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as Mode)} className="grid sm:grid-cols-3 gap-4">
                  {[
                    { v: "video", icon: Video, t: "Video call", d: "Zoom or Google Meet — most popular" },
                    { v: "phone", icon: Phone, t: "Phone call", d: "Quick and easy, just pick up" },
                    { v: "in-person", icon: MapPin, t: "In person", d: "Our Sydney office, Level 12" },
                  ].map((o) => (
                    <Label key={o.v} htmlFor={`m-${o.v}`} className={cn(
                      "rounded-xl border p-5 cursor-pointer transition-all block",
                      mode === o.v ? "border-accent bg-accent-soft/30 shadow-sm" : "border-border bg-card hover:border-accent/40",
                    )}>
                      <RadioGroupItem id={`m-${o.v}`} value={o.v} className="sr-only" />
                      <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center mb-3"><o.icon className="h-5 w-5" /></div>
                      <div className="font-display text-base">{o.t}</div>
                      <div className="text-xs text-muted-foreground mt-1">{o.d}</div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step === 3 && (
              <div className="mt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="b-name">Full name</Label>
                    <Input id="b-name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="mt-1.5" />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="b-phone">Phone</Label>
                    <Input id="b-phone" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} className="mt-1.5" />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="b-email">Email</Label>
                  <Input id="b-email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="mt-1.5" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="b-purpose">Loan purpose</Label>
                    <Select value={data.purpose} onValueChange={(v) => setData({ ...data, purpose: v })}>
                      <SelectTrigger id="b-purpose" className="mt-1.5"><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first-home">Buying first home</SelectItem>
                        <SelectItem value="next-home">Buying next home</SelectItem>
                        <SelectItem value="refinance">Refinance</SelectItem>
                        <SelectItem value="investment">Investment property</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.purpose && <p className="text-xs text-destructive mt-1">{errors.purpose}</p>}
                  </div>
                  <div>
                    <Label htmlFor="b-amount">Approx. price / loan amount</Label>
                    <Input id="b-amount" placeholder="$650,000" value={data.amount} onChange={(e) => setData({ ...data, amount: e.target.value })} className="mt-1.5" />
                    {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="b-notes">Notes (optional)</Label>
                  <Textarea id="b-notes" rows={3} maxLength={800} value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} className="mt-1.5 resize-none" placeholder="Anything we should know before the call?" />
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep((s) => (s === 1 ? 1 : (s as number) - 1) as 1 | 2 | 3)} disabled={step === 1}>
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              {step < 3 ? (
                <Button
                  type="button"
                  variant="gold"
                  onClick={() => setStep((s) => ((s as number) + 1) as 1 | 2 | 3)}
                  disabled={(step === 1 && (!date || !time))}
                >Continue</Button>
              ) : (
                <Button type="button" variant="gold" onClick={handleSubmit} disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Confirming…" : "Confirm appointment"}
                </Button>
              )}
            </div>
          </Card>

          {/* Summary chip */}
          {(date || time || mode) && step !== 1 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
              {date && <span className="rounded-full bg-secondary px-3 py-1.5">📅 {format(date, "EEE d MMM")}</span>}
              {time && <span className="rounded-full bg-secondary px-3 py-1.5">⏰ {time}</span>}
              <span className="rounded-full bg-secondary px-3 py-1.5">💬 {mode}</span>
            </div>
          )}
        </div>
      </Section>
    </>
  );
};

export default Book;
