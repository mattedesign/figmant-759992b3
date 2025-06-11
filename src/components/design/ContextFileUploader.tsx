import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, Trash2 } from 'lucide-react';
import { useUploadContextFile, useDesignContextFiles, useDeleteContextFile } from '@/hooks/useDesignContextFiles';

interface ContextFileUploaderProps {
  uploadId: string;
  onContextFilesChange?: (files: File[]) => void;
}

export const ContextFileUploader: React.FC<ContextFileUploaderProps> = ({ 
  uploadId, 
  onContextFilesChange 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const { data: existingFiles = [] } = useDesignContextFiles(uploadId);
  const uploadContextFile = useUploadContextFile();
  const deleteContextFile = useDeleteContextFile();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...selectedFiles, ...acceptedFiles];
    setSelectedFiles(newFiles);
    onContextFilesChange?.(newFiles);
  }, [selectedFiles, onContextFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.csv'],
      'application/pdf': ['.pdf'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onContextFilesChange?.(newFiles);
  };

  const handleUploadFiles = async () => {
    for (const file of selectedFiles) {
      await uploadContextFile.mutateAsync({ uploadId, file });
    }
    setSelectedFiles([]);
    onContextFilesChange?.([]);
  };

  const handleDeleteExisting = async (fileId: string) => {
    await deleteContextFile.mutateAsync(fileId);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.md')) return '📝';
    if (fileName.endsWith('.txt')) return '📄';
    if (fileName.endsWith('.pdf')) return '📕';
    if (fileName.endsWith('.json')) return '🔧';
    if (fileName.endsWith('.csv')) return '📊';
    return '📄';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Context Files</CardTitle>
        <p className="text-xs text-muted-foreground">
          Upload additional context files (briefs, guidelines, brand docs) to improve analysis quality
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Files */}
        {existingFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Existing Context Files</p>
            <div className="flex flex-wrap gap-2">
              {existingFiles.map((file) => (
                <Badge key={file.id} variant="outline" className="px-3 py-1">
                  <span className="mr-1">{getFileIcon(file.file_name)}</span>
                  <FileText className="h-3 w-3 mr-1" />
                  {file.file_name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => handleDeleteExisting(file.id)}
                    disabled={deleteContextFile.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-xs mb-1">
            {isDragActive
              ? 'Drop context files here'
              : 'Drag & drop context files, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: TXT, MD, PDF, JSON, CSV, DOC (max 5MB each)
          </p>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium">Selected Files ({selectedFiles.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  <span className="mr-1">{getFileIcon(file.name)}</span>
                  <FileText className="h-3 w-3 mr-1" />
                  {file.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Button
              onClick={handleUploadFiles}
              disabled={uploadContextFile.isPending}
              size="sm"
              className="w-full"
            >
              {uploadContextFile.isPending ? 'Uploading...' : 'Upload Context Files'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
