
import React, { useRef } from 'react';
import { StepProps } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link, Info, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Step5UploadFiles: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setStepData(prev => ({ 
        ...prev, 
        uploadedFiles: [...(prev.uploadedFiles || []), ...fileArray]
      }));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = stepData.uploadedFiles?.filter((_, i) => i !== index) || [];
    setStepData(prev => ({ ...prev, uploadedFiles: newFiles }));
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleReferenceLinksChange = (index: number, value: string) => {
    const newLinks = [...(stepData.referenceLinks || [''])];
    newLinks[index] = value;
    setStepData(prev => ({ 
      ...prev, 
      referenceLinks: newLinks
    }));
  };

  const addReferenceLink = () => {
    setStepData(prev => ({ 
      ...prev, 
      referenceLinks: [...(prev.referenceLinks || ['']), '']
    }));
  };

  const removeReferenceLink = (index: number) => {
    const newLinks = (stepData.referenceLinks || []).filter((_, i) => i !== index);
    setStepData(prev => ({ 
      ...prev, 
      referenceLinks: newLinks.length > 0 ? newLinks : ['']
    }));
  };

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">File Upload (Optional)</h2>
        <p className="text-center text-gray-600 mb-8">
          Upload design files, mockups, or reference materials to enhance your analysis
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="reference" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Reference Links
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>File Upload (Optional)</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload design files, mockups, or reference materials to enhance your analysis
                </p>
              </CardHeader>
              <CardContent>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.txt,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drag & drop files here, or click to select</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports: Images, PDFs, Text files, JSON (Max 10MB per file)
                  </p>
                  <Button variant="outline" onClick={handleChooseFiles}>
                    Choose Files
                  </Button>
                </div>
                
                {stepData.uploadedFiles && stepData.uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Uploaded Files:</h4>
                    <div className="space-y-2">
                      {stepData.uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reference" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Reference Links (Optional)</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add links to competitor websites, design inspiration, or other reference materials
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(stepData.referenceLinks || ['']).map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={link}
                        onChange={(e) => handleReferenceLinksChange(index, e.target.value)}
                        className="flex-1"
                      />
                      {stepData.referenceLinks && stepData.referenceLinks.length > 1 && (
                        <Button 
                          variant="ghost" 
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
                    onClick={addReferenceLink}
                    className="w-full"
                  >
                    Add Another Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Guidelines */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Guidelines</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
                <div>
                  <p className="font-medium mb-2">Files:</p>
                  <ul className="space-y-1">
                    <li>• Design files, mockups, wireframes</li>
                    <li>• Brand guidelines, style guides</li>
                    <li>• Requirements, research findings</li>
                    <li>• Analytics reports, user feedback</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Reference Links:</p>
                  <ul className="space-y-1">
                    <li>• Competitor websites</li>
                    <li>• Design inspiration sites</li>
                    <li>• Current website/app versions</li>
                    <li>• Industry benchmarks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
