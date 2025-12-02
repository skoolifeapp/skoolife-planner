-- Add recurrence_group_id column to calendar_events to link recurring events together
ALTER TABLE public.calendar_events 
ADD COLUMN recurrence_group_id uuid DEFAULT NULL;