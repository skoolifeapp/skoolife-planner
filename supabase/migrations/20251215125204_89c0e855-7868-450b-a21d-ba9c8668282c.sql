-- Add meeting format columns to session_invites
ALTER TABLE public.session_invites 
ADD COLUMN meeting_format text DEFAULT 'presentiel',
ADD COLUMN meeting_address text;