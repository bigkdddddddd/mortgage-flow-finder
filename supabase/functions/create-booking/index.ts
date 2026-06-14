const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "KM Financing <info@kmfinancing.com>";
const BUSINESS_EMAIL = "komailmousavi1@gmail.com";

interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  startISO: string;
  endISO: string;
  mode: string;
  purpose?: string;
  amount?: string;
  notes?: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

async function sendEmail(apiKey: string, to: string[], subject: string, html: string) {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from: FROM_ADDRESS, to, subject, html }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("resend error", data);
    throw new Error(`Resend ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");

    const p = (await req.json()) as BookingPayload;
    if (!p.name || !p.email || !p.phone || !p.startISO || !p.endISO) {
      return new Response(JSON.stringify({ error: "name, email, phone, startISO, endISO required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prettyTime = new Date(p.startISO).toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit",
    });

    const safeName = escapeHtml(p.name);
    const safeEmail = escapeHtml(p.email);
    const safePhone = escapeHtml(p.phone);
    const safeMode = escapeHtml(p.mode || "Not specified");
    const safePurpose = escapeHtml(p.purpose || "Not specified");
    const safeAmount = escapeHtml(p.amount || "Not specified");
    const safeNotes = p.notes ? escapeHtml(p.notes) : "None";

    const businessHtml = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:auto;padding:24px;color:#1a1a1a;">
        <h1 style="font-size:22px;margin:0 0 16px;">New booking request</h1>
        <div style="background:#f7f4ee;border:1px solid #e6dfd0;border-radius:12px;padding:16px;margin:16px 0;line-height:1.6;">
          <div><b>Name:</b> ${safeName}</div>
          <div><b>Email:</b> ${safeEmail}</div>
          <div><b>Phone:</b> ${safePhone}</div>
          <div><b>When:</b> ${prettyTime} (AEST)</div>
          <div><b>Mode:</b> ${safeMode}</div>
          <div><b>Purpose:</b> ${safePurpose}</div>
          <div><b>Amount:</b> ${safeAmount}</div>
          <div><b>Notes:</b><br>${safeNotes}</div>
        </div>
      </div>`;

    const customerHtml = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:auto;padding:24px;color:#1a1a1a;">
        <h1 style="font-size:22px;margin:0 0 12px;">Thanks, ${escapeHtml(p.name.split(" ")[0])}!</h1>
        <p style="color:#555;line-height:1.5;">We received your booking request with <b>KM Financing</b>.</p>
        <div style="background:#f7f4ee;border:1px solid #e6dfd0;border-radius:12px;padding:16px;margin:16px 0;line-height:1.6;">
          <div><b>Requested time:</b> ${prettyTime} (AEST)</div>
          <div><b>Mode:</b> ${safeMode}</div>
          <div><b>Topic:</b> ${safePurpose}</div>
        </div>
        <p style="color:#555;line-height:1.5;">We will be in touch to confirm the appointment. If anything changes, reply to this email or call us directly.</p>
        <p style="color:#888;font-size:12px;margin-top:24px;">— The KM Financing team</p>
      </div>`;

    const businessEmail = await sendEmail(
      RESEND_API_KEY,
      [BUSINESS_EMAIL],
      `New booking request — ${safeName} — ${prettyTime}`,
      businessHtml,
    );

    const customerEmail = await sendEmail(
      RESEND_API_KEY,
      [p.email],
      `Your KM Financing booking request — ${prettyTime}`,
      customerHtml,
    );

    return new Response(
      JSON.stringify({ success: true, businessEmailId: businessEmail?.id, customerEmailId: customerEmail?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("create-booking error", err);
    const msg = err instanceof Error ? err.message : "unknown";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
