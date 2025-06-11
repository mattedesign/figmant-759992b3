
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileImage, Globe } from 'lucide-react';
import { WizardData } from '../types';
import { FileUploadSection } from '../../uploader/FileUploadSection';
import { URLUploadSection } from '../../uploader/URLUploadSection';

interface Step2UploadFilesProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export const Step2UploadFiles: React.FC<Step2UploadFilesProps> = ({
  data,
  onUpdate
}) => {
  // Wrapper functions to handle setState pattern conversion
  const handleSelectedFilesChange = (files: File[] | ((prev: File[]) => File[])) => {
    if (typeof files === 'function') {
      onUpdate({ selectedFiles: files(data.selectedFiles) });
    } else {
      onUpdate({ selectedFiles: files });
    }
  };

  const handleUrlsChange = (urls: string[] | ((prev: string[]) => string[])) => {
    if (typeof urls === 'function') {
      onUpdate({ urls: urls(data.urls) });
    } else {
      onUpdate({ urls });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Upload Your Design Files</h2>
        <p className="text-muted-foreground">
          Upload design files or provide website URLs for analysis
        </p>
      </div>

      <Tabs 
        value={data.activeTab} 
        onValueChange={(value) => onUpdate({ activeTab: value as 'files' | 'urls' })}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="urls" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website URLs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          <FileUploadSection
            selectedFiles={data.selectedFiles}
            setSelectedFiles={handleSelectedFilesChange}
          />
        </TabsContent>

        <TabsContent value="urls" className="space-y-4">
          <URLUploadSection
            urls={data.urls}
            setUrls={handleUrlsChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
