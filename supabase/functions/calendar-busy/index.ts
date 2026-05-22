import { corsHeaders } from "@supabase/supabase-js/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_CALENDAR_API_KEY = Deno.env.get("GOOGLE_CALENDAR_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!GOOGLE_CALENDAR_API_KEY) throw new Error("GOOGLE_CALENDAR_API_KEY missing");

    const { timeMin, timeMax, timeZone = "Australia/Sydney" } = await req.json();
    if (!timeMin || !timeMax) {
      return new Response(JSON.stringify({ error: "timeMin & timeMax required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch(`${GATEWAY_URL}/freeBusy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
      },
      body: JSON.stringify({ timeMin, timeMax, timeZone, items: [{ id: "primary" }] }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Calendar ${res.status}: ${JSON.stringify(data)}`);

    const busy = data?.calendars?.primary?.busy ?? [];
    return new Response(JSON.stringify({ busy }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("calendar-busy error", err);
    const msg = err instanceof Error ? err.message : "unknown";
    return new Response(JSON.stringify({ success: false, error: msg, busy: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
