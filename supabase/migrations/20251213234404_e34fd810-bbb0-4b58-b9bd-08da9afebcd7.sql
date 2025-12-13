-- ================================================
-- INDEXES FOR SCALABILITY (20,000+ users)
-- ================================================

-- Profiles table - frequently queried
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_is_onboarding_complete ON public.profiles(is_onboarding_complete);

-- Subjects table - user lookups and exam date filtering
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON public.subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_subjects_exam_date ON public.subjects(exam_date);
CREATE INDEX IF NOT EXISTS idx_subjects_user_status ON public.subjects(user_id, status);

-- Revision sessions - heavy querying for planning
CREATE INDEX IF NOT EXISTS idx_revision_sessions_user_id ON public.revision_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_revision_sessions_date ON public.revision_sessions(date);
CREATE INDEX IF NOT EXISTS idx_revision_sessions_user_date ON public.revision_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_revision_sessions_subject_id ON public.revision_sessions(subject_id);

-- Calendar events - queried for planning grid
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON public.calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start ON public.calendar_events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_start ON public.calendar_events(user_id, start_datetime);

-- User activity - analytics queries
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);

-- Conversations - support system
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);

-- Conversation messages - message retrieval
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created_at ON public.conversation_messages(created_at DESC);

-- User preferences - one per user
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Constraints - planning algorithm
CREATE INDEX IF NOT EXISTS idx_constraints_user_id ON public.constraints(user_id);

-- AI plans - weekly planning lookup
CREATE INDEX IF NOT EXISTS idx_ai_plans_user_id ON public.ai_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_plans_week_start ON public.ai_plans(week_start_date);

-- User roles - admin checks
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Stats snapshots - date-based queries
CREATE INDEX IF NOT EXISTS idx_stats_snapshots_date ON public.stats_snapshots(snapshot_date DESC);