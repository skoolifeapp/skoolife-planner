import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Trash2, ExternalLink, Loader2, X } from 'lucide-react';
import { useSessionFiles, SessionFile } from '@/hooks/useSessionFiles';
import { toast } from 'sonner';

interface FileUploadPopoverProps {
  targetId: string;
  targetType: 'session' | 'event';
  onFileChange?: () => void;
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
].join(',');

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📊';
  if (fileType.includes('excel') || fileType.includes('sheet')) return '📈';
  if (fileType.includes('image')) return '🖼️';
  return '📎';
}

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

export const FileUploadPopover = ({ targetId, targetType, onFileChange }: FileUploadPopoverProps) => {
  const [files, setFiles] = useState<SessionFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, getFilesForSession, getFilesForEvent, getFileUrl, deleteFile } = useSessionFiles();

  const loadFiles = async () => {
    setLoading(true);
    const result = targetType === 'session' 
      ? await getFilesForSession(targetId)
      : await getFilesForEvent(targetId);
    setFiles(result);
    setLoading(false);
  };

  useEffect(() => {
    loadFiles();
  }, [targetId, targetType]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Create uploading file entries
    const newUploadingFiles: UploadingFile[] = Array.from(selectedFiles).map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending' as const
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    setIsUploading(true);

    // Upload files sequentially
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const uploadId = newUploadingFiles[i].id;

      // Update status to uploading
      setUploadingFiles(prev => 
        prev.map(f => f.id === uploadId ? { ...f, status: 'uploading' as const } : f)
      );

      try {
        const result = await uploadFile(file, targetId, targetType);
        if (result) {
          // Update status to done
          setUploadingFiles(prev => 
            prev.map(f => f.id === uploadId ? { ...f, status: 'done' as const } : f)
          );
        } else {
          // Update status to error
          setUploadingFiles(prev => 
            prev.map(f => f.id === uploadId ? { ...f, status: 'error' as const } : f)
          );
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        setUploadingFiles(prev => 
          prev.map(f => f.id === uploadId ? { ...f, status: 'error' as const } : f)
        );
      }
    }

    // Refresh file list and clear completed uploads
    await loadFiles();
    onFileChange?.();
    
    // Remove completed uploads after a delay
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.status === 'error'));
      setIsUploading(false);
    }, 1000);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancelUpload = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleOpenFile = async (file: SessionFile) => {
    const url = await getFileUrl(file.file_path);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleDeleteFile = async (file: SessionFile) => {
    const success = await deleteFile(file);
    if (success) {
      setFiles(prev => prev.filter(f => f.id !== file.id));
      onFileChange?.();
      toast.success('Fichier supprimé');
    }
  };

  // Calculate upload progress
  const completedUploads = uploadingFiles.filter(f => f.status === 'done').length;
  const totalUploads = uploadingFiles.length;
  const uploadProgress = totalUploads > 0 ? (completedUploads / totalUploads) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {files.length} fichier{files.length !== 1 ? 's' : ''}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileSelect}
          multiple
          className="hidden"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={isUploading}
          className="h-8 text-xs"
        >
          {isUploading ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Upload className="w-3 h-3 mr-1" />
          )}
          {isUploading ? 'Upload...' : 'Ajouter des fichiers'}
        </Button>
      </div>

      {/* Upload progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Upload en cours...</span>
            <span>{completedUploads}/{totalUploads}</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          
          {/* Uploading files list */}
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {uploadingFiles.map(file => (
              <div 
                key={file.id}
                className={`flex items-center gap-2 p-2 rounded-md text-xs ${
                  file.status === 'error' 
                    ? 'bg-destructive/10 border border-destructive/30' 
                    : file.status === 'done'
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-primary/10 border border-primary/30'
                }`}
              >
                <span className="text-sm">{getFileIcon(file.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {file.status === 'pending' && 'En attente...'}
                    {file.status === 'uploading' && 'Upload en cours...'}
                    {file.status === 'done' && '✓ Terminé'}
                    {file.status === 'error' && '✗ Erreur'}
                  </p>
                </div>
                {file.status === 'uploading' && (
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                )}
                {file.status === 'error' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCancelUpload(file.id);
                    }}
                    className="p-1 hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : files.length === 0 && uploadingFiles.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-3">
          Aucun fichier attaché
        </p>
      ) : files.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {files.map(file => (
            <div 
              key={file.id}
              className="flex items-center gap-2 p-2 rounded-md bg-background border hover:bg-muted/50 transition-colors group"
            >
              <span className="text-lg">{getFileIcon(file.file_type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{file.file_name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatFileSize(file.file_size)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenFile(file);
                  }}
                  className="p-1.5 hover:bg-muted rounded transition-colors"
                  title="Ouvrir"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteFile(file);
                  }}
                  className="p-1.5 hover:bg-destructive/10 rounded transition-colors text-destructive"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
