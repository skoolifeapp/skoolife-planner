-- Add UPDATE policy for session_files table to allow file replacement
CREATE POLICY "Users can update their own session files" 
ON public.session_files 
FOR UPDATE 
USING (auth.uid() = user_id);