-- Add event_type column to calendar_events for manual event categorization
ALTER TABLE public.calendar_events 
ADD COLUMN event_type text DEFAULT 'autre';