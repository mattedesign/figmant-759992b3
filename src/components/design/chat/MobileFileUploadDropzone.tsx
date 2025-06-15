
import React from 'react';
import { Upload, Camera, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileFileUploadDropzoneProps {
  storageStatus: 'checking' | 'ready' | 'error';
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  isLoading?: boolean;
}

export const MobileFileUploadDropzone: React.FC<MobileFileUploadDropzoneProps> = ({
  storageStatus,
  getRootProps,
  getInputProps,
  isDragActive,
  isLoading = false
}) => {
  const isMobile = useIsMobile();
  const isDisabled = storageStatus !== 'ready' || isLoading;

  const getDropzoneContent = () => {
    if (isLoading) {
      return {
        title: 'Processing...',
        subtitle: 'Please wait while we process your request',
        buttonText: 'Processing...',
        className: 'opacity-50'
      };
    }
    
    if (storageStatus === 'checking') {
      return {
        title: 'Checking Storage',
        subtitle: 'Please wait while we verify storage availability',
        buttonText: 'Please Wait...',
        className: 'opacity-50'
      };
    }
    
    if (storageStatus === 'error') {
      return {
        title: 'Storage Unavailable',
        subtitle: 'Files will be queued for when storage becomes available',
        buttonText: 'Queue Files',
        className: 'border-orange-300 bg-orange-50/50'
      };
    }
    
    return {
      title: isDragActive ? 'Drop files here' : 'Upload your designs',
      subtitle: 'Images (PNG, JPG, WebP) or PDFs',
      buttonText: 'Choose Files',
      className: ''
    };
  };

  const content = getDropzoneContent();

  if (isMobile) {
    return (
      <div className="px-4 mb-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
          } ${
            isDragActive && !isDisabled
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 bg-muted/20'
          } ${content.className}`}
        >
          <input {...getInputProps()} disabled={isDisabled} />
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
              <p className="text-sm font-medium">{content.title}</p>
              <p className="text-xs text-muted-foreground">{content.subtitle}</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              disabled={isDisabled}
            >
              <Upload className="h-4 w-4 mr-2" />
              {content.buttonText}
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
      className={`border-2 border-dashed rounded-lg p-4 text-center mb-4 transition-colors ${
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${
        isDragActive && !isDisabled
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary/50'
      } ${content.className}`}
    >
      <input {...getInputProps()} disabled={isDisabled} />
      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{content.subtitle}</p>
    </div>
  );
};
