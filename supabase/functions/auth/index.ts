import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key (server-side only)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, action } = await req.json()

    if (action === 'signIn') {
      // Sign in user
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Return user data and session
      return new Response(
        JSON.stringify({ 
          user: data.user,
          session: data.session 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (action === 'signOut') {
      // Sign out user
      const { error } = await supabaseAdmin.auth.signOut()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ message: 'Signed out successfully' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (action === 'getUser') {
      // Get current user from session token
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'No authorization header' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ user }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})