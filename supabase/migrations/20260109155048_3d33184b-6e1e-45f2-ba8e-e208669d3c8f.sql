
-- Add RLS policy to allow school admins to view their students' revision sessions
CREATE POLICY "School admins can view their students revision_sessions" 
ON public.revision_sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM school_members sm_admin
    JOIN school_members sm_student ON sm_admin.school_id = sm_student.school_id
    WHERE sm_admin.user_id = auth.uid()
      AND sm_admin.role = 'admin_school'
      AND sm_admin.is_active = true
      AND sm_student.user_id = revision_sessions.user_id
      AND sm_student.role = 'student'
      AND sm_student.is_active = true
  )
);
