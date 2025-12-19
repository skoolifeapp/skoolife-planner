import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SessionFile {
  id: string;
  user_id: string;
  session_id: string | null;
  event_id: string | null;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
  subject_name?: string | null;
  valid_from?: string;
}

export function useSessionFiles() {
  const [uploading, setUploading] = useState(false);

  const uploadFile = useCallback(async (
    file: File,
    targetId: string,
    targetType: 'session' | 'event',
    subjectName?: string
  ): Promise<SessionFile | null> => {
    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour uploader un fichier');
        return null;
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${targetType}/${targetId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course_files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Erreur lors de l\'upload du fichier');
        return null;
      }

      // Create record in session_files table with subject_name for sharing
      const fileRecord: any = {
        user_id: user.id,
        session_id: targetType === 'session' ? targetId : null,
        event_id: targetType === 'event' ? targetId : null,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        subject_name: subjectName || null
      };

      const { data, error } = await supabase
        .from('session_files')
        .insert(fileRecord)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        // Cleanup uploaded file
        await supabase.storage.from('course_files').remove([filePath]);
        toast.error('Erreur lors de l\'enregistrement du fichier');
        return null;
      }

      return data as SessionFile;
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error('Erreur lors de l\'upload');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const getFilesForSession = useCallback(async (sessionId: string): Promise<SessionFile[]> => {
    const { data, error } = await supabase
      .from('session_files')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching session files:', error);
      return [];
    }

    return data as SessionFile[];
  }, []);

  const getFilesForEvent = useCallback(async (eventId: string): Promise<SessionFile[]> => {
    const { data, error } = await supabase
      .from('session_files')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching event files:', error);
      return [];
    }

    return data as SessionFile[];
  }, []);

  // Get all files shared at subject level, filtered by date for versioning
  // blockDate: the date of the current block to filter versions
  const getFilesForSubject = useCallback(async (subjectName: string, blockDate?: Date): Promise<SessionFile[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('session_files')
      .select('*')
      .eq('user_id', user.id)
      .eq('subject_name', subjectName);

    // If blockDate provided, only get files valid at that date
    if (blockDate) {
      query = query.lte('valid_from', blockDate.toISOString());
    }

    const { data, error } = await query.order('valid_from', { ascending: false });

    if (error) {
      console.error('Error fetching subject files:', error);
      return [];
    }

    // Group by file_name and keep only the most recent version for each
    const latestByName = new Map<string, SessionFile>();
    for (const file of (data as SessionFile[])) {
      if (!latestByName.has(file.file_name)) {
        latestByName.set(file.file_name, file);
      }
    }

    return Array.from(latestByName.values());
  }, []);

  const getFileUrl = useCallback(async (filePath: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from('course_files')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.error('Error getting file URL:', error);
      return null;
    }

    return data.signedUrl;
  }, []);

  const deleteFile = useCallback(async (file: SessionFile): Promise<boolean> => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('course_files')
        .remove([file.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      // Delete from database
      const { error } = await supabase
        .from('session_files')
        .delete()
        .eq('id', file.id);

      if (error) {
        console.error('Database delete error:', error);
        toast.error('Erreur lors de la suppression');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error deleting file:', err);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  }, []);

  // Replace file: creates a NEW version (keeps old for history)
  // The new version will have valid_from = now(), so it won't appear in past blocks
  const replaceFile = useCallback(async (
    existingFile: SessionFile,
    newFile: File
  ): Promise<SessionFile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté');
        return null;
      }

      // Upload new file to storage
      const fileExt = newFile.name.split('.').pop();
      const storageFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const targetType = existingFile.session_id ? 'session' : 'event';
      const targetId = existingFile.session_id || existingFile.event_id;
      const filePath = `${user.id}/${targetType}/${targetId}/${storageFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course_files')
        .upload(filePath, newFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Erreur lors de l\'upload du fichier');
        return null;
      }

      // Create a NEW record (don't update existing) - this preserves history
      // Use the SAME file_name so versioning works correctly
      const { data, error } = await supabase
        .from('session_files')
        .insert({
          user_id: user.id,
          session_id: existingFile.session_id,
          event_id: existingFile.event_id,
          file_name: existingFile.file_name, // Keep same name for version grouping
          file_path: filePath,
          file_size: newFile.size,
          file_type: newFile.type,
          subject_name: existingFile.subject_name,
          valid_from: new Date().toISOString() // New version starts now
        })
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        await supabase.storage.from('course_files').remove([filePath]);
        toast.error('Erreur lors de la mise à jour');
        return null;
      }

      toast.success('Fichier mis à jour pour ce bloc et les suivants');
      return data as SessionFile;
    } catch (err) {
      console.error('Error replacing file:', err);
      toast.error('Erreur lors du remplacement');
      return null;
    }
  }, []);

  return {
    uploading,
    uploadFile,
    getFilesForSession,
    getFilesForEvent,
    getFilesForSubject,
    getFileUrl,
    deleteFile,
    replaceFile
  };
}
