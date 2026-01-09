-- Fix "RLS Policy Always True" warning on school_leads
DROP POLICY IF EXISTS "Anyone can submit school lead" ON public.school_leads;
CREATE POLICY "Anyone can submit school lead" 
ON public.school_leads
FOR INSERT
TO public
WITH CHECK (
  length(trim(contact_email)) > 3
  AND position('@' in contact_email) > 1
  AND length(trim(school_name)) > 1
);
