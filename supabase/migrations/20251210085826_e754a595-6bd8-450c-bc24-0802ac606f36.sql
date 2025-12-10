-- Enable REPLICA IDENTITY FULL for remaining tables
ALTER TABLE public.ai_plans REPLICA IDENTITY FULL;
ALTER TABLE public.constraints REPLICA IDENTITY FULL;
ALTER TABLE public.user_feedback REPLICA IDENTITY FULL;
ALTER TABLE public.user_preferences REPLICA IDENTITY FULL;
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;

-- Add remaining tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.constraints;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_feedback;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_preferences;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;