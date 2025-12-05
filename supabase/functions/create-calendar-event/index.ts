import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    const {
      userId,
      bookingId,
      summary,
      description,
      startTime,
      endTime,
      attendeeEmail,
      attendeeName,
      location,
      timezone,
    } = await req.json();

    if (!userId || !startTime || !endTime) {
      throw new Error("Missing required parameters");
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
        JSON.stringify({
          error: "No active calendar connection",
          warning: "Booking created but calendar event not created"
        }),
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

    const attendees = [];
    if (attendeeEmail) {
      attendees.push({
        email: attendeeEmail,
        displayName: attendeeName || attendeeEmail,
      });
    }

    const event = {
      summary: summary || "Booking",
      description: description || "",
      start: {
        dateTime: startTime,
        timeZone: timezone || "UTC",
      },
      end: {
        dateTime: endTime,
        timeZone: timezone || "UTC",
      },
      attendees,
      location: location || "",
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
      conferenceData: location?.includes("meet.google.com") ? {
        createRequest: {
          requestId: `booking-${bookingId}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      } : undefined,
    };

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${connection.calendar_id}/events?conferenceDataVersion=1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      console.error("Calendar API error:", errorText);
      throw new Error(`Calendar API error: ${calendarResponse.status}`);
    }

    const createdEvent = await calendarResponse.json();

    if (bookingId) {
      const { error: mappingError } = await supabase
        .from("booking_calendar_events")
        .upsert({
          booking_id: bookingId,
          calendar_event_id: createdEvent.id,
          calendar_link: createdEvent.htmlLink,
        });

      if (mappingError) {
        console.error("Failed to store event mapping:", mappingError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        eventId: createdEvent.id,
        eventLink: createdEvent.htmlLink,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Create calendar event error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});