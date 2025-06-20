
import React from 'react';
import { StepProps } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Link, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Step5UploadFiles: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    setStepData(prev => ({ 
      ...prev, 
      uploadedFiles: [...(prev.uploadedFiles || []), ...fileArray]
    }));
  };

  const handleReferenceLinksChange = (links: string[]) => {
    setStepData(prev => ({ 
      ...prev, 
      referenceLinks: links
    }));
  };

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Upload Files & Reference Links</h2>
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drag & drop files here, or click to select</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports: Images, PDFs, Text files, JSON (Max 10MB per file)
                  </p>
                  <Button variant="outline">
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
                            onClick={() => {
                              const newFiles = stepData.uploadedFiles?.filter((_, i) => i !== index) || [];
                              setStepData(prev => ({ ...prev, uploadedFiles: newFiles }));
                            }}
                          >
                            Remove
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
                  Add URLs to competitor websites, design inspiration, or related resources
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(stepData.referenceLinks || ['']).map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={link}
                        onChange={(e) => {
                          const newLinks = [...(stepData.referenceLinks || [''])];
                          newLinks[index] = e.target.value;
                          handleReferenceLinksChange(newLinks);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {index > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const newLinks = stepData.referenceLinks?.filter((_, i) => i !== index) || [];
                            handleReferenceLinksChange(newLinks);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const newLinks = [...(stepData.referenceLinks || ['']), ''];
                      handleReferenceLinksChange(newLinks);
                    }}
                  >
                    Add Another Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Guidelines Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Files:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Design files, mockups, wireframes</li>
                  <li>• Brand guidelines, style guides</li>
                  <li>• Requirements, research findings</li>
                  <li>• Analytics reports, user feedback</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Reference Links:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
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
