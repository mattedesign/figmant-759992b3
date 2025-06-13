
import React from 'react';
import { Upload, FileText, Image, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface EnhancedFileUploadDropzoneProps {
  storageStatus: 'checking' | 'ready' | 'error';
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  processingFiles?: Array<{
    id: string;
    name: string;
    progress: number;
    status: 'uploading' | 'processing' | 'complete' | 'error';
  }>;
}

export const EnhancedFileUploadDropzone: React.FC<EnhancedFileUploadDropzoneProps> = ({
  storageStatus,
  getRootProps,
  getInputProps,
  isDragActive,
  isUploading = false,
  uploadProgress = 0,
  processingFiles = []
}) => {
  const isDisabled = storageStatus !== 'ready' || isUploading;
  
  const getStorageStatusContent = () => {
    switch (storageStatus) {
      case 'checking':
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Checking storage...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Storage unavailable</span>
          </div>
        );
      case 'ready':
        return null;
      default:
        return null;
    }
  };

  const getUploadContent = () => {
    if (isUploading) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="font-medium">Uploading files...</span>
          </div>
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                {uploadProgress}% complete
              </p>
            </div>
          )}
        </div>
      );
    }

    if (isDragActive) {
      return (
        <div className="space-y-2 text-primary">
          <div className="flex justify-center">
            <div className="animate-bounce">
              <Upload className="h-8 w-8" />
            </div>
          </div>
          <p className="text-center font-medium">Drop files here to upload</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <p className="font-medium">Drop files here or click to browse</p>
          <p className="text-sm text-muted-foreground">
            Supports images (PNG, JPG, GIF, WebP) and PDFs up to 50MB
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Image className="h-3 w-3" />
            Images
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            PDFs
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <Card 
        {...getRootProps()} 
        className={`
          p-6 border-2 border-dashed transition-all duration-200 cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 hover:bg-muted/25'}
        `}
      >
        <input {...getInputProps()} disabled={isDisabled} />
        
        {getStorageStatusContent() || getUploadContent()}
      </Card>

      {processingFiles.length > 0 && (
        <Card className="p-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
              Processing Files ({processingFiles.length})
            </h4>
            <div className="space-y-2">
              {processingFiles.map((file) => (
                <div key={file.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{file.name}</span>
                    <Badge 
                      variant={file.status === 'error' ? 'destructive' : 'default'}
                      className="text-xs"
                    >
                      {file.status}
                    </Badge>
                  </div>
                  {file.status !== 'error' && (
                    <Progress value={file.progress} className="h-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
