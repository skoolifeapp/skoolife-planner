import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get auth header to verify user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user's JWT
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { invite_id, first_name } = await req.json()

    if (!invite_id) {
      return new Response(
        JSON.stringify({ error: 'invite_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Accepting invite:', { invite_id, user_id: user.id, first_name })

    // 1. Update profile with first name + mark onboarding complete + signed_up_via_invite
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        first_name: first_name?.trim() || null,
        is_onboarding_complete: true,
        signed_up_via_invite: true,
      }, { onConflict: 'id' })

    if (profileError) {
      console.error('Profile upsert error:', profileError)
      return new Response(
        JSON.stringify({ error: 'Failed to update profile', details: profileError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Get the invite first to check session info
    const { data: existingInvite } = await supabase
      .from('session_invites')
      .select('id, session_id')
      .eq('id', invite_id)
      .maybeSingle()

    if (!existingInvite) {
      return new Response(
        JSON.stringify({ error: 'Invite not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Get session date
    const { data: sessionData } = await supabase
      .from('revision_sessions')
      .select('date')
      .eq('id', existingInvite.session_id)
      .maybeSingle()

    // 4. Update the invite record to mark it as accepted
    const { error: updateError } = await supabase
      .from('session_invites')
      .update({
        accepted_by: user.id,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invite_id)

    if (updateError) {
      console.error('Invite update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to accept invite', details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Invite accepted successfully:', { invite_id, session_id: existingInvite.session_id })

    return new Response(
      JSON.stringify({ 
        success: true, 
        session_id: existingInvite.session_id,
        session_date: sessionData?.date || null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    const error = err as Error
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})