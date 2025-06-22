
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, Link, Image, FileText, X } from 'lucide-react';
import { StepProps } from '../types';

export const Step2SmartUpload: React.FC<StepProps> = ({
  stepData,
  setStepData,
  currentStep,
  totalSteps,
  onNextStep,
  onPreviousStep
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [urls, setUrls] = useState<string[]>(stepData.referenceLinks || ['']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    const currentFiles = stepData.uploadedFiles || [];
    const newFiles = [...currentFiles, ...files];
    
    // Also update the uploads structure for backward compatibility
    const currentUploads = stepData.uploads || { images: [], urls: [], files: [], screenshots: [] };
    const newUploads = { ...currentUploads };
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        newUploads.images = [...newUploads.images, file];
      } else {
        newUploads.files = [...newUploads.files, file];
      }
    });
    
    setStepData(prev => ({ 
      ...prev, 
      uploadedFiles: newFiles,
      uploads: newUploads
    }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(Array.from(files));
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = value;
    setUrls(updatedUrls);
    setStepData(prev => ({ 
      ...prev, 
      referenceLinks: updatedUrls,
      uploads: {
        ...prev.uploads,
        urls: updatedUrls.filter(url => url.trim() !== '')
      }
    }));
  };

  const addUrl = () => {
    const updatedUrls = [...urls, ''];
    setUrls(updatedUrls);
    setStepData(prev => ({ 
      ...prev, 
      referenceLinks: updatedUrls
    }));
  };

  const removeUrl = (index: number) => {
    const updatedUrls = urls.filter((_, i) => i !== index);
    setUrls(updatedUrls);
    setStepData(prev => ({ 
      ...prev, 
      referenceLinks: updatedUrls.length > 0 ? updatedUrls : [''],
      uploads: {
        ...prev.uploads,
        urls: updatedUrls.filter(url => url.trim() !== '')
      }
    }));
  };

  const removeFile = (index: number) => {
    const currentFiles = stepData.uploadedFiles || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    
    // Also update uploads structure
    const currentUploads = stepData.uploads || { images: [], urls: [], files: [], screenshots: [] };
    const removedFile = currentFiles[index];
    let newUploads = { ...currentUploads };
    
    if (removedFile?.type.startsWith('image/')) {
      newUploads.images = newUploads.images.filter((_, i) => i !== index);
    } else {
      newUploads.files = newUploads.files.filter((_, i) => i !== index);
    }
    
    setStepData(prev => ({ 
      ...prev, 
      uploadedFiles: newFiles,
      uploads: newUploads
    }));
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const totalFiles = stepData.uploadedFiles?.length || 0;
  const hasContent = totalFiles > 0 || urls.some(url => url.trim() !== '');

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Upload Your Content</h2>
        <p className="text-center text-gray-600 mb-8">
          Add screenshots, designs, competitor URLs, or documents for analysis (optional)
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf,.txt,.json,.fig"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Drag & Drop Zone */}
        <Card>
          <CardContent 
            className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleChooseFiles}
          >
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                Drag & drop files here, or click to browse
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Supports images, PDFs, Figma files, and documents (Max 10MB per file)
              </p>
              <Button variant="outline" type="button">
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* URL Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              Add URLs for Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {urls.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeUrl(index)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={addUrl}
                className="w-full"
                type="button"
              >
                Add Another URL
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload Summary */}
        {hasContent && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Content ({totalFiles} files, {urls.filter(url => url.trim()).length} URLs)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stepData.uploadedFiles?.map((file: File, index: number) => (
                  <div key={`file-${index}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    {file.type.startsWith('image/') ? (
                      <Image className="w-4 h-4 text-blue-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-green-600" />
                    )}
                    <span className="flex-1 truncate text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFile(index)}
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {urls.filter(url => url.trim()).map((url, index) => (
                  <div key={`url-${index}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Link className="w-4 h-4 text-purple-600" />
                    <span className="flex-1 truncate text-sm">{url}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeUrl(urls.indexOf(url))}
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guidelines */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-blue-900">📁 Recommended Files:</h4>
                <ul className="space-y-1 text-blue-800">
                  <li>• Design mockups & wireframes</li>
                  <li>• Current website screenshots</li>
                  <li>• Brand guidelines</li>
                  <li>• User research data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-blue-900">🔗 Useful URLs:</h4>
                <ul className="space-y-1 text-blue-800">
                  <li>• Competitor websites</li>
                  <li>• Your current site/app</li>
                  <li>• Design inspiration</li>
                  <li>• Industry benchmarks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPreviousStep}>
            Previous
          </Button>
          <Button onClick={onNextStep}>
            Continue to Context
          </Button>
        </div>
      </div>
    </div>
  );
};
