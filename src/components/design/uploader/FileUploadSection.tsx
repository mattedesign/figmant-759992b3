
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, FileImage, X, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PreUploadValidator } from '@/components/design/chat/PreUploadValidator';

interface FileUploadSectionProps {
  selectedFiles: File[];
  setSelectedFiles: (files: File[] | ((prev: File[]) => File[])) => void;
}

export const FileUploadSection = ({
  selectedFiles,
  setSelectedFiles
}: FileUploadSectionProps) => {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidator, setShowValidator] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPendingFiles(acceptedFiles);
    setValidationErrors([]);
    setShowValidator(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleValidationComplete = (validFiles: File[], errors: string[]) => {
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setValidationErrors(errors);
    setShowValidator(false);
    setPendingFiles([]);

    if (errors.length > 0) {
      console.warn('File validation errors:', errors);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
          ${selectedFiles.length > 0 ? 'border-green-500 bg-green-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-sm mb-2">
          {isDragActive
            ? 'Drop your design files here'
            : 'Drag & drop multiple design files here, or click to select'}
        </p>
        <p className="text-xs text-muted-foreground">
          Supports: PNG, JPG, PDF (max 50MB each)
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Images will be automatically validated and resized for AI analysis if needed
        </p>
      </div>

      {/* Pre-Upload Validation */}
      {showValidator && pendingFiles.length > 0 && (
        <div className="border rounded-lg p-4 bg-blue-50">
          <PreUploadValidator
            files={pendingFiles}
            onValidationComplete={handleValidationComplete}
          />
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Some files couldn't be processed:</p>
              <ul className="list-disc list-inside text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files ({selectedFiles.length})</Label>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                <FileImage className="h-3 w-3 mr-1" />
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
        </div>
      )}
    </div>
  );
};
