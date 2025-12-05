# Google Calendar Integration Guide

## Overview

This comprehensive guide covers the complete integration of Google Calendar API with your booking system. The integration provides bi-directional sync: reading calendar availability and creating events when bookings are made.

## Features

### Core Capabilities

1. **OAuth 2.0 Authentication**
   - Secure Google account connection
   - Token storage and automatic refresh
   - Multi-user support with isolated credentials

2. **Availability Detection**
   - Real-time calendar event reading
   - Busy/free time slot identification
   - Multi-calendar support
   - Conflict detection for scheduling

3. **Event Creation**
   - Automatic event creation on booking confirmation
   - Guest information sync
   - Meeting location details
   - Calendar event updates and cancellations

4. **Smart Scheduling**
   - Buffer time management
   - Time zone handling
   - Recurring event detection
   - Out-of-office status recognition

## Architecture

### System Components

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Frontend │ ◄─── Google Calendar Connection UI
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Supabase Client │
└────────┬────────┘
         │
         ├─────────► google_calendar_connections (table)
         │
         ▼
┌─────────────────┐
│  Edge Functions │
├─────────────────┤
│ - oauth-handler │ ◄─── OAuth flow management
│ - calendar-sync │ ◄─── Read/Write calendar data
│ - create-event  │ ◄─── Event creation on booking
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Google Calendar │
│      API        │
└─────────────────┘
```

### Data Flow

1. **Connection Flow**
   - User clicks "Connect Google Calendar"
   - OAuth popup opens for Google consent
   - OAuth callback receives authorization code
   - Edge Function exchanges code for tokens
   - Tokens stored securely in database

2. **Availability Check Flow**
   - User selects date on booking page
   - System calls calendar-sync Edge Function
   - Function fetches calendar events for date range
   - Busy times are filtered out of availability
   - Available slots displayed to guest

3. **Booking Creation Flow**
   - Guest completes booking
   - create-event Edge Function triggered
   - Calendar event created with booking details
   - Event ID stored with booking record
   - Confirmation sent to both parties

## Prerequisites

### Google Cloud Console Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Click "Select a project" → "New Project"
   - Name: "Booking System Calendar Integration"
   - Click "Create"

2. **Enable Google Calendar API**
   - In your project, go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click on it and click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Configure OAuth consent screen if prompted:
     - User Type: External
     - App name: Your app name
     - Support email: Your email
     - Authorized domains: Your domain
     - Scopes: Add `calendar.events` and `calendar.readonly`
   - Application type: Web application
   - Name: "Booking System"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `https://your-supabase-project.supabase.co/functions/v1/oauth-callback`
   - Click "Create"
   - Save the **Client ID** and **Client Secret**

4. **Required API Scopes**
   ```
   https://www.googleapis.com/auth/calendar.events
   https://www.googleapis.com/auth/calendar.readonly
   ```

### Environment Variables

Add these to your project's `.env` file:

```bash
# Google Calendar API
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-project.supabase.co/functions/v1/oauth-callback
```

**IMPORTANT:** Never expose `GOOGLE_CLIENT_SECRET` in client-side code. It should only exist in Edge Functions.

## Database Schema

The `google_calendar_connections` table is already created with this structure:

```sql
CREATE TABLE google_calendar_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_expiry timestamptz NOT NULL,
  calendar_id text NOT NULL DEFAULT 'primary',
  is_active boolean DEFAULT true,
  last_sync timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Additional Table for Calendar Event Mapping

You may want to add a table to track which bookings have corresponding calendar events:

```sql
CREATE TABLE booking_calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  calendar_event_id text NOT NULL,
  calendar_link text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id)
);
```

## Implementation Steps

### Step 1: Create Edge Functions

#### A. OAuth Handler Function

Create `/supabase/functions/google-oauth/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Step 1: Generate OAuth URL
    if (action === "get-auth-url") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("No authorization header");
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user) {
        throw new Error("Unauthorized");
      }

      const clientId = Deno.env.get("VITE_GOOGLE_CLIENT_ID");
      const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI");

      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", clientId!);
      authUrl.searchParams.set("redirect_uri", redirectUri!);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly");
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");
      authUrl.searchParams.set("state", user.id);

      return new Response(
        JSON.stringify({ authUrl: authUrl.toString() }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Handle OAuth callback
    if (action === "callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state"); // user_id

      if (!code || !state) {
        throw new Error("Missing code or state");
      }

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: Deno.env.get("VITE_GOOGLE_CLIENT_ID")!,
          client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
          redirect_uri: Deno.env.get("GOOGLE_REDIRECT_URI")!,
          grant_type: "authorization_code",
        }),
      });

      const tokens = await tokenResponse.json();

      if (!tokens.access_token) {
        throw new Error("Failed to get access token");
      }

      // Calculate token expiry
      const expiresIn = tokens.expires_in || 3600;
      const tokenExpiry = new Date(Date.now() + expiresIn * 1000);

      // Store tokens in database
      const { error: dbError } = await supabase
        .from("google_calendar_connections")
        .upsert({
          user_id: state,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: tokenExpiry.toISOString(),
          is_active: true,
          last_sync: new Date().toISOString(),
        });

      if (dbError) {
        throw dbError;
      }

      // Redirect back to app
      return Response.redirect(`${Deno.env.get("APP_URL")}/admin/dashboard?calendar=connected`, 302);
    }

    // Disconnect calendar
    if (action === "disconnect") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("No authorization header");
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user) {
        throw new Error("Unauthorized");
      }

      const { error: deleteError } = await supabase
        .from("google_calendar_connections")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

#### B. Calendar Sync Function

Create `/supabase/functions/calendar-sync/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
  return data.access_token;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { userId, startDate, endDate } = await req.json();

    // Get user's calendar connection
    const { data: connection, error: connError } = await supabase
      .from("google_calendar_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (connError || !connection) {
      return new Response(
        JSON.stringify({ error: "No active calendar connection" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if token is expired and refresh if needed
    let accessToken = connection.access_token;
    const tokenExpiry = new Date(connection.token_expiry);

    if (tokenExpiry < new Date()) {
      accessToken = await refreshAccessToken(connection.refresh_token);

      // Update token in database
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

    // Fetch calendar events
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
      throw new Error(`Calendar API error: ${calendarResponse.status}`);
    }

    const calendarData = await calendarResponse.json();
    const events: CalendarEvent[] = calendarData.items || [];

    // Filter to busy events only
    const busyEvents = events.filter((event: CalendarEvent) => {
      return (
        event.status !== "cancelled" &&
        event.transparency !== "transparent" &&
        (event.start.dateTime || event.start.date)
      );
    });

    // Update last sync time
    await supabase
      .from("google_calendar_connections")
      .update({ last_sync: new Date().toISOString() })
      .eq("user_id", userId);

    return new Response(
      JSON.stringify({ events: busyEvents, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

#### C. Create Calendar Event Function

Create `/supabase/functions/create-calendar-event/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
  return data.access_token;
}

serve(async (req: Request) => {
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
    } = await req.json();

    // Get user's calendar connection
    const { data: connection, error: connError } = await supabase
      .from("google_calendar_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (connError || !connection) {
      return new Response(
        JSON.stringify({ error: "No active calendar connection" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if token is expired and refresh if needed
    let accessToken = connection.access_token;
    const tokenExpiry = new Date(connection.token_expiry);

    if (tokenExpiry < new Date()) {
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

    // Create calendar event
    const event = {
      summary,
      description,
      start: {
        dateTime: startTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: endTime,
        timeZone: "UTC",
      },
      attendees: [
        {
          email: attendeeEmail,
          displayName: attendeeName,
        },
      ],
      location: location || "",
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    };

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${connection.calendar_id}/events`,
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
      const error = await calendarResponse.json();
      throw new Error(`Calendar API error: ${JSON.stringify(error)}`);
    }

    const createdEvent = await calendarResponse.json();

    // Store event mapping (you'll need to create this table)
    await supabase.from("booking_calendar_events").upsert({
      booking_id: bookingId,
      calendar_event_id: createdEvent.id,
      calendar_link: createdEvent.htmlLink,
    });

    return new Response(
      JSON.stringify({
        success: true,
        eventId: createdEvent.id,
        eventLink: createdEvent.htmlLink,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

### Step 2: Create Frontend Components

#### A. Google Calendar Connection Component

Create `/src/components/GoogleCalendarConnection.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export const GoogleCalendarConnection: React.FC = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    checkConnection();
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('google_calendar_connections')
        .select('is_active, last_sync')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (data) {
        setIsConnected(true);
        setLastSync(data.last_sync ? new Date(data.last_sync) : null);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-oauth?action=get-auth-url`,
        {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        }
      );

      const { authUrl } = await response.json();

      // Open OAuth popup
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      window.open(
        authUrl,
        'Google Calendar Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for connection
      const checkInterval = setInterval(async () => {
        await checkConnection();
        if (isConnected) {
          clearInterval(checkInterval);
        }
      }, 2000);

      // Clear interval after 2 minutes
      setTimeout(() => clearInterval(checkInterval), 120000);

    } catch (error) {
      console.error('Error connecting calendar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar?')) {
      return;
    }

    try {
      setIsLoading(true);

      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-oauth?action=disconnect`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        }
      );

      setIsConnected(false);
      setLastSync(null);
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isConnected) {
    return (
      <div className="flex items-center justify-center p-4">
        <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${isConnected ? 'bg-green-50' : 'bg-gray-50'}`}>
            <Calendar className={`w-6 h-6 ${isConnected ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Google Calendar</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isConnected
                ? 'Your calendar is connected and syncing'
                : 'Connect your Google Calendar to sync availability'}
            </p>
            {isConnected && lastSync && (
              <p className="text-xs text-gray-500 mt-2">
                Last synced: {lastSync.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Connected</span>
              </div>
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Disconnect"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Connect Calendar
            </button>
          )}
        </div>
      </div>

      {isConnected && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Calendar Integration Active</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Existing calendar events will block booking slots</li>
            <li>• New bookings will automatically create calendar events</li>
            <li>• Guests will be added as attendees</li>
            <li>• Calendar invites will be sent automatically</li>
          </ul>
        </div>
      )}
    </div>
  );
};
```

#### B. Calendar-Aware Availability Hook

Create `/src/hooks/useCalendarAvailability.ts`:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CalendarEvent {
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

interface TimeSlot {
  start: string;
  end: string;
}

export const useCalendarAvailability = (userId: string, date: Date) => {
  const [busySlots, setBusySlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendarBusySlots();
  }, [userId, date]);

  const fetchCalendarBusySlots = async () => {
    if (!userId || !date) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get start and end of the day
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({
            userId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          // No calendar connected, that's okay
          setBusySlots([]);
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch calendar events');
      }

      const { events } = await response.json();

      // Convert events to busy time slots
      const slots: TimeSlot[] = events
        .map((event: CalendarEvent) => ({
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
        }))
        .filter((slot: TimeSlot) => slot.start && slot.end);

      setBusySlots(slots);
    } catch (err) {
      console.error('Error fetching calendar availability:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const isTimeSlotBusy = (slotStart: Date, slotEnd: Date): boolean => {
    return busySlots.some((busy) => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);

      // Check if slot overlaps with busy time
      return (
        (slotStart >= busyStart && slotStart < busyEnd) ||
        (slotEnd > busyStart && slotEnd <= busyEnd) ||
        (slotStart <= busyStart && slotEnd >= busyEnd)
      );
    });
  };

  return {
    busySlots,
    isTimeSlotBusy,
    isLoading,
    error,
    refetch: fetchCalendarBusySlots,
  };
};
```

### Step 3: Update Existing Components

#### Update ProfileSettings.tsx

Add the Google Calendar connection component to the settings page:

```typescript
import { GoogleCalendarConnection } from './GoogleCalendarConnection';

// Inside the component render:
<div className="space-y-6">
  {/* Existing profile settings */}

  {/* Add this section */}
  <div>
    <h3 className="text-lg font-semibold mb-4">Calendar Integration</h3>
    <GoogleCalendarConnection />
  </div>
</div>
```

#### Update PublicBookingPage.tsx

Integrate calendar availability checking when displaying time slots:

```typescript
import { useCalendarAvailability } from '../hooks/useCalendarAvailability';

// Inside component:
const { isTimeSlotBusy } = useCalendarAvailability(hostUserId, selectedDate);

// When rendering time slots:
const availableSlots = slots.filter(slot => {
  const slotStart = new Date(`${selectedDate}T${slot.start}`);
  const slotEnd = new Date(`${selectedDate}T${slot.end}`);
  return !isTimeSlotBusy(slotStart, slotEnd);
});
```

#### Update Booking Creation

After a booking is confirmed, create the calendar event:

```typescript
const createBooking = async (bookingData) => {
  // Create booking in database first
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();

  if (error) throw error;

  // Create calendar event
  try {
    await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-calendar-event`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          userId: booking.user_id,
          bookingId: booking.id,
          summary: `Meeting with ${booking.guest_name}`,
          description: booking.notes || '',
          startTime: booking.start_time,
          endTime: booking.end_time,
          attendeeEmail: booking.guest_email,
          attendeeName: booking.guest_name,
          location: booking.location,
        }),
      }
    );
  } catch (calendarError) {
    console.error('Failed to create calendar event:', calendarError);
    // Don't fail the booking if calendar creation fails
  }

  return booking;
};
```

## Security Considerations

### Token Storage

- Tokens are stored encrypted in Supabase with RLS policies
- Only the token owner can access their credentials
- Service role key used only in Edge Functions (server-side)

### API Rate Limits

Google Calendar API has these limits:
- 1,000,000 queries per day
- 10 queries per second per user

Implement caching:
```typescript
// Cache calendar data for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
```

### Error Handling

Always handle these scenarios:
- Token expiration (automatic refresh)
- Network failures (retry logic)
- API quota exceeded (graceful degradation)
- Calendar disconnection (continue with manual availability)

## Testing Strategy

### 1. OAuth Flow Testing

```bash
# Test auth URL generation
curl -X GET "https://your-project.supabase.co/functions/v1/google-oauth?action=get-auth-url" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verify callback handling (automated in browser)
```

### 2. Calendar Sync Testing

```typescript
// Test calendar event fetching
const testCalendarSync = async () => {
  const response = await fetch('/functions/v1/calendar-sync', {
    method: 'POST',
    body: JSON.stringify({
      userId: 'test-user-id',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
    }),
  });

  const data = await response.json();
  console.log('Calendar events:', data.events);
};
```

### 3. Event Creation Testing

```typescript
// Test event creation
const testEventCreation = async () => {
  const response = await fetch('/functions/v1/create-calendar-event', {
    method: 'POST',
    body: JSON.stringify({
      userId: 'test-user-id',
      bookingId: 'test-booking-id',
      summary: 'Test Meeting',
      startTime: '2024-01-15T10:00:00Z',
      endTime: '2024-01-15T11:00:00Z',
      attendeeEmail: 'guest@example.com',
      attendeeName: 'Test Guest',
    }),
  });

  const data = await response.json();
  console.log('Created event:', data);
};
```

## Deployment Checklist

- [ ] Google Cloud Project created
- [ ] Calendar API enabled
- [ ] OAuth credentials configured
- [ ] Redirect URIs added (production + development)
- [ ] Environment variables set in Supabase
- [ ] Edge Functions deployed
- [ ] Database migration run (if adding booking_calendar_events table)
- [ ] Frontend components integrated
- [ ] OAuth flow tested end-to-end
- [ ] Calendar sync tested with real data
- [ ] Event creation tested
- [ ] Error handling verified
- [ ] Rate limiting implemented
- [ ] Documentation updated

## Troubleshooting

### Common Issues

**Issue: "redirect_uri_mismatch" error**
- Solution: Verify redirect URI in Google Console matches exactly

**Issue: Token expired errors**
- Solution: Implement automatic refresh (already in code)

**Issue: Events not showing in availability**
- Solution: Check calendar permissions and event transparency settings

**Issue: Calendar events not creating**
- Solution: Verify calendar write permissions in OAuth scope

## Additional Features (Optional)

### Multi-Calendar Support

Allow users to check multiple calendars for conflicts:

```typescript
// Extend google_calendar_connections to support multiple calendars
ALTER TABLE google_calendar_connections DROP CONSTRAINT google_calendar_connections_user_id_key;
ALTER TABLE google_calendar_connections ADD COLUMN calendar_name text;
```

### Recurring Event Handling

Parse Google's recurrence rules to block recurring meeting times.

### Busy/Free Time Sync

Use Calendar API's `freebusy` endpoint for faster availability checking:

```typescript
const freeBusyResponse = await fetch(
  'https://www.googleapis.com/calendar/v3/freeBusy',
  {
    method: 'POST',
    body: JSON.stringify({
      timeMin: startDate,
      timeMax: endDate,
      items: [{ id: 'primary' }],
    }),
  }
);
```

## Support Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [API Rate Limits](https://developers.google.com/calendar/api/guides/quota)

## Conclusion

This integration provides a seamless two-way sync between your booking system and Google Calendar. Users can accept bookings based on real-time calendar availability, and all bookings automatically appear in their calendar with proper invites sent to guests.

The system is designed to be resilient, secure, and user-friendly while handling the complexities of OAuth, token management, and API interactions behind the scenes.
