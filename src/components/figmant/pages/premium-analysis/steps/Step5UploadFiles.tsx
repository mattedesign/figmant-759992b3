
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, File, X, AlertCircle, Globe, Plus, Link } from 'lucide-react';

export const Step5UploadFiles: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const currentFiles = stepData.uploadedFiles || [];
    const newFiles = [...currentFiles, ...acceptedFiles];
    setStepData(prev => ({ ...prev, uploadedFiles: newFiles }));
  }, [stepData.uploadedFiles, setStepData]);

  const removeFile = (index: number) => {
    const currentFiles = stepData.uploadedFiles || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    setStepData(prev => ({ ...prev, uploadedFiles: newFiles }));
  };

  const addReferenceLink = () => {
    const currentLinks = stepData.referenceLinks || [''];
    const newLinks = [...currentLinks, ''];
    setStepData(prev => ({ ...prev, referenceLinks: newLinks }));
  };

  const updateReferenceLink = (index: number, value: string) => {
    const currentLinks = stepData.referenceLinks || [''];
    const newLinks = currentLinks.map((link, i) => i === index ? value : link);
    setStepData(prev => ({ ...prev, referenceLinks: newLinks }));
  };

  const removeReferenceLink = (index: number) => {
    const currentLinks = stepData.referenceLinks || [''];
    if (currentLinks.length > 1) {
      const newLinks = currentLinks.filter((_, i) => i !== index);
      setStepData(prev => ({ ...prev, referenceLinks: newLinks }));
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

  const validLinks = (stepData.referenceLinks || []).filter(link => link.trim() !== '');

  return (
    <div>
      <StepHeader 
        title="Upload Files & Reference Links"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="files" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Reference Links
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader className="px-0">
                <CardTitle>File Upload (Optional)</CardTitle>
                <CardDescription>
                  Upload design files, mockups, or reference materials to enhance your analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
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
                <CardHeader className="px-0">
                  <CardTitle>Uploaded Files ({stepData.uploadedFiles.length})</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
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
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <Card>
              <CardHeader className="px-0">
                <CardTitle>Reference Links (Optional)</CardTitle>
                <CardDescription>
                  Add website URLs, competitor sites, or reference materials for analysis context
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-0">
                {(stepData.referenceLinks || ['']).map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`link-${index}`} className="sr-only">
                        Reference Link {index + 1}
                      </Label>
                      <Input
                        id={`link-${index}`}
                        placeholder="https://example.com or competitor website"
                        value={link}
                        onChange={(e) => updateReferenceLink(index, e.target.value)}
                      />
                    </div>
                    {(stepData.referenceLinks || []).length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeReferenceLink(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addReferenceLink}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Link
                </Button>
              </CardContent>
            </Card>

            {/* Valid Links Summary */}
            {validLinks.length > 0 && (
              <Card>
                <CardHeader className="px-0">
                  <CardTitle>Reference Links ({validLinks.length})</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-2">
                    {validLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Link className="h-4 w-4 text-gray-400" />
                        <span className="text-sm truncate">{link}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Guidelines */}
        <Card>
          <CardHeader className="px-0">
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Files:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Design files, mockups, wireframes</li>
                  <li>• Brand guidelines, style guides</li>
                  <li>• Requirements, research findings</li>
                  <li>• Analytics reports, user feedback</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Reference Links:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Competitor websites</li>
                  <li>• Design inspiration sites</li>
                  <li>• Current website/app versions</li>
                  <li>• Industry benchmarks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
