import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  status: string;
  transparency?: string;
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Deno.env.get("VITE_GOOGLE_CLIENT_ID")!,
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Failed to refresh access token");
  }

  return data.access_token;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { userId, startDate, endDate } = await req.json();

    if (!userId || !startDate || !endDate) {
      throw new Error("Missing required parameters: userId, startDate, or endDate");
    }

    const { data: connection, error: connError } = await supabase
      .from("google_calendar_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (connError) {
      throw connError;
    }

    if (!connection) {
      return new Response(
        JSON.stringify({ error: "No active calendar connection", events: [] }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let accessToken = connection.access_token;
    const tokenExpiry = new Date(connection.token_expiry);

    if (tokenExpiry < new Date()) {
      console.log("Token expired, refreshing...");
      accessToken = await refreshAccessToken(connection.refresh_token);

      const expiresIn = 3600;
      const newExpiry = new Date(Date.now() + expiresIn * 1000);

      await supabase
        .from("google_calendar_connections")
        .update({
          access_token: accessToken,
          token_expiry: newExpiry.toISOString(),
        })
        .eq("user_id", userId);
    }

    const calendarUrl = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${connection.calendar_id}/events`
    );

    calendarUrl.searchParams.set("timeMin", new Date(startDate).toISOString());
    calendarUrl.searchParams.set("timeMax", new Date(endDate).toISOString());
    calendarUrl.searchParams.set("singleEvents", "true");
    calendarUrl.searchParams.set("orderBy", "startTime");

    const calendarResponse = await fetch(calendarUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      console.error("Calendar API error:", errorText);
      throw new Error(`Calendar API error: ${calendarResponse.status}`);
    }

    const calendarData = await calendarResponse.json();
    const events: CalendarEvent[] = calendarData.items || [];

    const busyEvents = events.filter((event: CalendarEvent) => {
      return (
        event.status !== "cancelled" &&
        event.transparency !== "transparent" &&
        (event.start.dateTime || event.start.date)
      );
    });

    await supabase
      .from("google_calendar_connections")
      .update({ last_sync: new Date().toISOString() })
      .eq("user_id", userId);

    return new Response(
      JSON.stringify({ events: busyEvents, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Calendar sync error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        events: []
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});