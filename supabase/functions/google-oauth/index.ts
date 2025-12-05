import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
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
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    // Handle OAuth callback from Google (no auth required - this is a browser redirect)
    if (code && state) {
      console.log("Handling Google OAuth callback");
      
      const clientId = Deno.env.get("VITE_GOOGLE_CLIENT_ID");
      const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
      const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI");

      if (!clientId || !clientSecret || !redirectUri) {
        const appUrl = Deno.env.get("APP_URL") || "http://localhost:5173";
        return Response.redirect(
          `${appUrl}/admin/dashboard?calendar=error&message=Google Calendar configuration missing`,
          302
        );
      }

      // Exchange authorization code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokens = await tokenResponse.json();

      if (!tokens.access_token) {
        console.error("Token exchange failed:", tokens);
        const appUrl = Deno.env.get("APP_URL") || "http://localhost:5173";
        const errorMsg = encodeURIComponent(tokens.error_description || tokens.error || "Failed to connect calendar");
        return Response.redirect(
          `${appUrl}/admin/dashboard?calendar=error&message=${errorMsg}`,
          302
        );
      }

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
        console.error("Database error:", dbError);
        const appUrl = Deno.env.get("APP_URL") || "http://localhost:5173";
        return Response.redirect(
          `${appUrl}/admin/dashboard?calendar=error&message=${encodeURIComponent(dbError.message)}`,
          302
        );
      }

      // Success! Redirect back to app
      const appUrl = Deno.env.get("APP_URL") || "http://localhost:5173";
      return Response.redirect(`${appUrl}/admin/dashboard?calendar=connected`, 302);
    }

    // Handle get-auth-url action (requires auth)
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

      if (!clientId || !redirectUri) {
        return new Response(
          JSON.stringify({
            error: "Google Calendar integration is not configured",
            details: "Missing required environment variables: VITE_GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI",
            setup_required: true
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("redirect_uri", redirectUri);
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

    // Handle disconnect action (requires auth)
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
    console.error("Google OAuth error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});