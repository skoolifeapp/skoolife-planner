import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DAILY_API_KEY = Deno.env.get('DAILY_API_KEY');
    
    if (!DAILY_API_KEY) {
      console.error('DAILY_API_KEY is not set');
      throw new Error('Daily.co API key not configured');
    }

    const { sessionId, sessionDate, sessionTime, subjectName } = await req.json();
    
    console.log('Creating Daily.co room for session:', sessionId);

    // Create a unique room name based on session
    const roomName = `skoolife-${sessionId.slice(0, 8)}-${Date.now()}`;
    
    // Calculate expiry time (24 hours after the session)
    const sessionDateTime = new Date(`${sessionDate}T${sessionTime}`);
    const expiryTime = Math.floor(sessionDateTime.getTime() / 1000) + (24 * 60 * 60);

    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          exp: expiryTime,
          enable_chat: true,
          enable_screenshare: true,
          start_video_off: false,
          start_audio_off: false,
          max_participants: 10,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Daily.co API error:', errorData);
      throw new Error(`Failed to create Daily.co room: ${response.status}`);
    }

    const roomData = await response.json();
    console.log('Daily.co room created:', roomData.url);

    return new Response(
      JSON.stringify({ 
        roomUrl: roomData.url,
        roomName: roomData.name 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating Daily.co room:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
