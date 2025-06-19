
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { StepProps, StepData } from '../types';
import { StepHeader } from '../components/StepHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, X, AlertCircle } from 'lucide-react';

export const Step5UploadFiles: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const currentFiles = stepData.uploadedFiles || [];
    const newFiles = [...currentFiles, ...acceptedFiles];
    
    if (typeof setStepData === 'function') {
      const funcStr = setStepData.toString();
      if (funcStr.includes('key') || setStepData.length === 2) {
        (setStepData as (key: string, value: any) => void)('uploadedFiles', newFiles);
      } else {
        (setStepData as (newData: StepData) => void)({ ...stepData, uploadedFiles: newFiles });
      }
    }
  }, [stepData, setStepData]);

  const removeFile = (index: number) => {
    const currentFiles = stepData.uploadedFiles || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    
    if (typeof setStepData === 'function') {
      const funcStr = setStepData.toString();
      if (funcStr.includes('key') || setStepData.length === 2) {
        (setStepData as (key: string, value: any) => void)('uploadedFiles', newFiles);
      } else {
        (setStepData as (newData: StepData) => void)({ ...stepData, uploadedFiles: newFiles });
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md'],
      'application/json': ['.json']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Upload Supporting Files"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>File Upload (Optional)</CardTitle>
            <CardDescription>
              Upload design files, mockups, or reference materials to enhance your analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-primary hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-lg font-medium">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: Images, PDFs, Text files, JSON (Max 10MB per file)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files List */}
        {stepData.uploadedFiles && stepData.uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Files ({stepData.uploadedFiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stepData.uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Upload Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>File Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Design Files:</strong> Screenshots, mockups, wireframes</li>
              <li>• <strong>Reference Materials:</strong> Brand guidelines, style guides</li>
              <li>• <strong>Documentation:</strong> Requirements, user research findings</li>
              <li>• <strong>Data Files:</strong> Analytics reports, user feedback</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
