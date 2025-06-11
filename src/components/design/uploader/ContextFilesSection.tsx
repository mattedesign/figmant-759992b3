
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, X } from 'lucide-react';

interface ContextFilesSectionProps {
  contextFiles: File[];
  setContextFiles: (files: File[] | ((prev: File[]) => File[])) => void;
  isEnabled: boolean;
}

export const ContextFilesSection = ({
  contextFiles,
  setContextFiles,
  isEnabled
}: ContextFilesSectionProps) => {
  const onContextDrop = useCallback((acceptedFiles: File[]) => {
    setContextFiles(prev => [...prev, ...acceptedFiles]);
  }, [setContextFiles]);

  const { getRootProps: getContextRootProps, getInputProps: getContextInputProps, isDragActive: isContextDragActive } = useDropzone({
    onDrop: onContextDrop,
    accept: {
      'text/*': ['.txt', '.md', '.csv'],
      'application/pdf': ['.pdf'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeContextFile = (index: number) => {
    setContextFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.md')) return '📝';
    if (fileName.endsWith('.txt')) return '📄';
    if (fileName.endsWith('.pdf')) return '📕';
    if (fileName.endsWith('.json')) return '🔧';
    if (fileName.endsWith('.csv')) return '📊';
    return '📄';
  };

  if (!isEnabled) return null;

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Context Files (Optional)
      </Label>
      <div
        {...getContextRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isContextDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
        `}
      >
        <input {...getContextInputProps()} />
        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-xs mb-1">
          {isContextDragActive
            ? 'Drop context files here'
            : 'Upload brand guidelines, briefs, or documentation'}
        </p>
        <p className="text-xs text-muted-foreground">
          Supports: TXT, MD, PDF, JSON, CSV, DOC (max 5MB each)
        </p>
      </div>

      {contextFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Context Files ({contextFiles.length})</Label>
          <div className="flex flex-wrap gap-2">
            {contextFiles.map((file, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                <span className="mr-1">{getFileIcon(file.name)}</span>
                <FileText className="h-3 w-3 mr-1" />
                {file.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => removeContextFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
