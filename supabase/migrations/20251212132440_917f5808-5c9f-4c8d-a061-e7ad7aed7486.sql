-- Create table for school pre-registrations
CREATE TABLE public.school_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  school_type TEXT,
  student_count TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.school_leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit school lead"
ON public.school_leads
FOR INSERT
WITH CHECK (true);

-- Only admins can view school leads
CREATE POLICY "Admins can view school leads"
ON public.school_leads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete school leads
CREATE POLICY "Admins can delete school leads"
ON public.school_leads
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));