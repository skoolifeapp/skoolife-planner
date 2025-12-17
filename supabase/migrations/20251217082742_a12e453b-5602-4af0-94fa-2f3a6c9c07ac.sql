-- Create table for URL links attached to sessions/events
CREATE TABLE public.session_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.revision_sessions(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT session_links_target_check CHECK (
    (session_id IS NOT NULL AND event_id IS NULL) OR
    (session_id IS NULL AND event_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE public.session_links ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own links"
ON public.session_links FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own links"
ON public.session_links FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links"
ON public.session_links FOR DELETE
USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_session_links_session_id ON public.session_links(session_id);
CREATE INDEX idx_session_links_event_id ON public.session_links(event_id);