
import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadDropzoneProps {
  storageStatus: 'checking' | 'ready' | 'error';
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  storageStatus,
  getRootProps,
  getInputProps,
  isDragActive
}) => {
  if (storageStatus !== 'ready') {
    return null;
  }

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
