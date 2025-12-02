-- Add session duration preference
ALTER TABLE public.user_preferences
ADD COLUMN session_duration_minutes integer DEFAULT 90;