import { corsHeaders } from "@supabase/supabase-js/cors";

const CAL_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";
const RESEND_URL = "https://connector-gateway.lovable.dev/resend";
const FROM_ADDRESS = "Meridian Mortgage <onboarding@resend.dev>";

interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  startISO: string; // ISO datetime
  endISO: string;
  mode: string;
  purpose?: string;
  amount?: string;
  notes?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_CALENDAR_API_KEY = Deno.env.get("GOOGLE_CALENDAR_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY || !GOOGLE_CALENDAR_API_KEY || !RESEND_API_KEY) {
      throw new Error("Missing one of LOVABLE_API_KEY, GOOGLE_CALENDAR_API_KEY, RESEND_API_KEY");
    }

    const p = (await req.json()) as BookingPayload;
    if (!p.name || !p.email || !p.startISO || !p.endISO) {
      return new Response(JSON.stringify({ error: "name, email, startISO, endISO required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1) Create Google Calendar event
    const eventBody = {
      summary: `Mortgage consultation — ${p.name}`,
      description: [
        `Mode: ${p.mode}`,
        `Phone: ${p.phone}`,
        p.purpose ? `Purpose: ${p.purpose}` : null,
        p.amount ? `Amount: ${p.amount}` : null,
        p.notes ? `\nNotes:\n${p.notes}` : null,
      ].filter(Boolean).join("\n"),
      start: { dateTime: p.startISO, timeZone: "Australia/Sydney" },
      end: { dateTime: p.endISO, timeZone: "Australia/Sydney" },
      attendees: [{ email: p.email, displayName: p.name }],
    };

    const calRes = await fetch(`${CAL_URL}/calendars/primary/events?sendUpdates=all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
      },
      body: JSON.stringify(eventBody),
    });
    const calData = await calRes.json();
    if (!calRes.ok) {
      console.error("calendar error", calData);
      throw new Error(`Calendar ${calRes.status}: ${JSON.stringify(calData)}`);
    }

    // 2) Send confirmation email via Resend
    const prettyTime = new Date(p.startISO).toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
      weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit",
    });

    const html = `
      <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width:560px; margin:auto; padding:24px; color:#1a1a1a;">
        <h1 style="font-size:22px; margin:0 0 12px;">You're booked in, ${p.name.split(" ")[0]}! 🎉</h1>
        <p style="color:#555; line-height:1.5;">Thanks for booking a consultation with <b>Meridian Mortgage</b>. Here are the details:</p>
        <div style="background:#f7f4ee; border:1px solid #e6dfd0; border-radius:12px; padding:16px; margin:16px 0;">
          <div><b>When:</b> ${prettyTime} (AEST)</div>
          <div><b>Mode:</b> ${p.mode}</div>
          ${p.purpose ? `<div><b>Topic:</b> ${p.purpose}</div>` : ""}
        </div>
        <p style="color:#555; line-height:1.5;">We've added it to our calendar and sent you an invite. Have your payslips, ID, and a recent bank statement handy — it'll speed things along.</p>
        <p style="color:#888; font-size:12px; margin-top:24px;">Need to reschedule? Just reply to this email.</p>
      </div>`;

    const mailRes = await fetch(`${RESEND_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [p.email],
        subject: `Your consultation is confirmed — ${prettyTime}`,
        html,
      }),
    });
    const mailData = await mailRes.json();
    if (!mailRes.ok) console.error("email error", mailData);

    return new Response(JSON.stringify({
      success: true,
      eventId: calData?.id,
      htmlLink: calData?.htmlLink,
      emailSent: mailRes.ok,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("create-booking error", err);
    const msg = err instanceof Error ? err.message : "unknown";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
