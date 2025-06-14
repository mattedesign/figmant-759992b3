
import React from 'react';
import { Upload, Camera, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileFileUploadDropzoneProps {
  storageStatus: 'checking' | 'ready' | 'error';
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
}

export const MobileFileUploadDropzone: React.FC<MobileFileUploadDropzoneProps> = ({
  storageStatus,
  getRootProps,
  getInputProps,
  isDragActive
}) => {
  const isMobile = useIsMobile();

  if (storageStatus !== 'ready') {
    return null;
  }

  if (isMobile) {
    return (
      <div className="px-4 mb-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 bg-muted/20'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <div className="p-3 rounded-full bg-muted">
                <Camera className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="p-3 rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop files here' : 'Upload your designs'}
              </p>
              <p className="text-xs text-muted-foreground">
                Images (PNG, JPG, WebP) or PDFs
              </p>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center mb-4 transition-colors cursor-pointer ${
        isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        {isDragActive 
          ? 'Drop files here...' 
          : 'Drag & drop images or PDFs, or click to select'
        }
      </p>
    </div>
  );
};
