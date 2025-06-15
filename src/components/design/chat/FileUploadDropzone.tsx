
import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadDropzoneProps {
  storageStatus: 'checking' | 'ready' | 'error';
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  isLoading?: boolean;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  storageStatus,
  getRootProps,
  getInputProps,
  isDragActive,
  isLoading = false
}) => {
  // Show dropzone even when storage is not ready, but indicate the state
  const isDisabled = storageStatus !== 'ready' || isLoading;
  
  const getDropzoneContent = () => {
    if (isLoading) {
      return {
        text: 'Processing... Please wait',
        className: 'opacity-50 cursor-not-allowed'
      };
    }
    
    if (storageStatus === 'checking') {
      return {
        text: 'Checking storage... Please wait',
        className: 'opacity-50'
      };
    }
    
    if (storageStatus === 'error') {
      return {
        text: 'Storage unavailable - Files will be queued',
        className: 'opacity-75 border-orange-300'
      };
    }
    
    return {
      text: isDragActive ? 'Drop files here...' : 'Drag & drop images or PDFs, or click to select',
      className: ''
    };
  };

  const content = getDropzoneContent();

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-2 text-center mb-4 transition-colors ${
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${
        isDragActive && !isDisabled
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary/50'
      } ${content.className}`}
    >
      <input {...getInputProps()} disabled={isDisabled} />
      <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">
        {content.text}
      </p>
    </div>
  );
};
