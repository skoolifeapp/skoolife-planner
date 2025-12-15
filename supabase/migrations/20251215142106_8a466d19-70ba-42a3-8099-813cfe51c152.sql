-- Add meeting_link column to store the Daily.co room URL
ALTER TABLE public.session_invites 
ADD COLUMN IF NOT EXISTS meeting_link text;