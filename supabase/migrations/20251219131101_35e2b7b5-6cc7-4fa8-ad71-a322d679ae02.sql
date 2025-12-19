-- Add valid_from column to track when each file version becomes active
ALTER TABLE public.session_files 
ADD COLUMN valid_from timestamp with time zone NOT NULL DEFAULT now();

-- Create index for efficient querying
CREATE INDEX idx_session_files_valid_from ON public.session_files(subject_name, valid_from DESC);