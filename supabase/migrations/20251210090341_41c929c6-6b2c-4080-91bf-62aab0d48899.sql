-- Add CASCADE DELETE foreign keys to profiles table for all user-related tables

-- ai_plans
ALTER TABLE public.ai_plans 
DROP CONSTRAINT IF EXISTS ai_plans_user_id_fkey;
ALTER TABLE public.ai_plans 
ADD CONSTRAINT ai_plans_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- calendar_events
ALTER TABLE public.calendar_events 
DROP CONSTRAINT IF EXISTS calendar_events_user_id_fkey;
ALTER TABLE public.calendar_events 
ADD CONSTRAINT calendar_events_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- constraints
ALTER TABLE public.constraints 
DROP CONSTRAINT IF EXISTS constraints_user_id_fkey;
ALTER TABLE public.constraints 
ADD CONSTRAINT constraints_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- conversations
ALTER TABLE public.conversations 
DROP CONSTRAINT IF EXISTS conversations_user_id_fkey;
ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- revision_sessions
ALTER TABLE public.revision_sessions 
DROP CONSTRAINT IF EXISTS revision_sessions_user_id_fkey;
ALTER TABLE public.revision_sessions 
ADD CONSTRAINT revision_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- subjects
ALTER TABLE public.subjects 
DROP CONSTRAINT IF EXISTS subjects_user_id_fkey;
ALTER TABLE public.subjects 
ADD CONSTRAINT subjects_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- user_feedback
ALTER TABLE public.user_feedback 
DROP CONSTRAINT IF EXISTS user_feedback_user_id_fkey;
ALTER TABLE public.user_feedback 
ADD CONSTRAINT user_feedback_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- user_preferences
ALTER TABLE public.user_preferences 
DROP CONSTRAINT IF EXISTS user_preferences_user_id_fkey;
ALTER TABLE public.user_preferences 
ADD CONSTRAINT user_preferences_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- user_roles
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;