
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileImage } from 'lucide-react';
import { useDesignUseCases } from '@/hooks/useDesignUseCases';
import { useUploadDesign } from '@/hooks/useUploadDesign';
import { useState } from 'react';

export const DesignUploader = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { data: useCases = [], isLoading: loadingUseCases } = useDesignUseCases();
  const uploadDesign = useUploadDesign();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleUpload = async () => {
    if (!selectedFile || !selectedUseCase) return;

    await uploadDesign.mutateAsync({
      file: selectedFile,
      useCase: selectedUseCase
    });

    // Reset form
    setSelectedFile(null);
    setSelectedUseCase('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Design for Analysis</CardTitle>
        <CardDescription>
          Upload your design file and select an analysis type to get AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
            ${selectedFile ? 'border-green-500 bg-green-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <div className="space-y-2">
              <FileImage className="h-12 w-12 mx-auto text-green-600" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-sm">
                {isDragActive
                  ? 'Drop your design file here'
                  : 'Drag & drop your design file here, or click to select'}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: PNG, JPG, PDF (max 10MB)
              </p>
            </div>
          )}
        </div>

        {/* Use Case Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Analysis Type</label>
          <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
            <SelectTrigger>
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              {useCases.map((useCase) => (
                <SelectItem key={useCase.id} value={useCase.id}>
                  <div>
                    <div className="font-medium">{useCase.name}</div>
                    <div className="text-xs text-muted-foreground">{useCase.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !selectedUseCase || uploadDesign.isPending}
          className="w-full"
        >
          {uploadDesign.isPending ? 'Uploading...' : 'Upload & Analyze'}
        </Button>
      </CardContent>
    </Card>
  );
};
