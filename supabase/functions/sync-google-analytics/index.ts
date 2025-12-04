import { createClient } from 'npm:@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: integration, error: integrationError } = await supabaseClient
      .from('platform_integrations')
      .select('*')
      .eq('platform_type', 'google_analytics')
      .maybeSingle();

    if (integrationError || !integration) {
      return new Response(
        JSON.stringify({ error: 'Google Analytics not connected' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!integration.is_connected || !integration.credentials) {
      return new Response(
        JSON.stringify({ error: 'Google Analytics credentials not configured' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const credentials = integration.credentials as Record<string, any>;
    const propertyId = credentials.property_id;
    const clientId = credentials.client_id;
    const clientSecret = credentials.client_secret;
    const refreshToken = credentials.refresh_token;
    let accessToken = credentials.access_token;

    if (!propertyId || !clientId || !clientSecret || !refreshToken) {
      return new Response(
        JSON.stringify({ error: 'Missing required credentials: property_id, client_id, client_secret, or refresh_token' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const refreshAccessToken = async () => {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        throw new Error(`Failed to refresh token: ${errorData}`);
      }

      const tokenData = await tokenResponse.json();
      const newAccessToken = tokenData.access_token;

      await supabaseClient
        .from('platform_integrations')
        .update({
          credentials: {
            ...credentials,
            access_token: newAccessToken,
          }
        })
        .eq('platform_type', 'google_analytics');

      return newAccessToken;
    };

    if (!accessToken) {
      accessToken = await refreshAccessToken();
    }

    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate') || '30daysAgo';
    const endDate = url.searchParams.get('endDate') || 'today';

    const gaResponse = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'date' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
            { name: 'conversions' },
          ],
        }),
      }
    );

    if (!gaResponse.ok) {
      if (gaResponse.status === 401) {
        try {
          accessToken = await refreshAccessToken();

          const retryResponse = await fetch(
            `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                dateRanges: [{ startDate, endDate }],
                dimensions: [{ name: 'date' }],
                metrics: [
                  { name: 'activeUsers' },
                  { name: 'sessions' },
                  { name: 'screenPageViews' },
                  { name: 'bounceRate' },
                  { name: 'averageSessionDuration' },
                  { name: 'conversions' },
                ],
              }),
            }
          );

          if (!retryResponse.ok) {
            const errorText = await retryResponse.text();
            return new Response(
              JSON.stringify({
                error: 'Failed to fetch Google Analytics data after token refresh',
                details: errorText,
                status: retryResponse.status
              }),
              {
                status: retryResponse.status,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          }

          const analyticsData = await retryResponse.json();

          await supabaseClient
            .from('platform_integrations')
            .update({ last_synced_at: new Date().toISOString() })
            .eq('platform_type', 'google_analytics');

          return new Response(
            JSON.stringify({
              success: true,
              data: analyticsData,
              lastSynced: new Date().toISOString(),
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        } catch (refreshError) {
          return new Response(
            JSON.stringify({
              error: 'Failed to refresh access token',
              details: refreshError instanceof Error ? refreshError.message : 'Unknown error'
            }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }

      const errorText = await gaResponse.text();
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch Google Analytics data',
          details: errorText,
          status: gaResponse.status
        }),
        {
          status: gaResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const analyticsData = await gaResponse.json();

    await supabaseClient
      .from('platform_integrations')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('platform_type', 'google_analytics');

    return new Response(
      JSON.stringify({
        success: true,
        data: analyticsData,
        lastSynced: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});