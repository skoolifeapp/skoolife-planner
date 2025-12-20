-- Create the session-files storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('session-files', 'session-files', true);

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload their own session files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'session-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view session files (public bucket)
CREATE POLICY "Session files are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'session-files');

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own session files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'session-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);