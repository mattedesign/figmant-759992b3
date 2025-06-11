
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileImage, Globe } from 'lucide-react';
import { useBatchUploadDesign } from '@/hooks/useBatchUploadDesign';
import { AnalysisPreferences } from '@/types/design';
import { BatchInfoSection } from './uploader/BatchInfoSection';
import { AnalysisPreferencesSection } from './uploader/AnalysisPreferencesSection';
import { FileUploadSection } from './uploader/FileUploadSection';
import { URLUploadSection } from './uploader/URLUploadSection';
import { ContextFilesSection } from './uploader/ContextFilesSection';
import { UseCaseSelector } from './uploader/UseCaseSelector';
import { UploadSummary } from './uploader/UploadSummary';

export const EnhancedDesignUploader = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [contextFiles, setContextFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>(['']);
  const [batchName, setBatchName] = useState<string>('');
  const [analysisGoals, setAnalysisGoals] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'files' | 'urls'>('files');
  const [analysisPreferences, setAnalysisPreferences] = useState<AnalysisPreferences>({
    auto_comparative: true,
    context_integration: true,
    analysis_depth: 'detailed'
  });
  
  const batchUpload = useBatchUploadDesign();

  const validUrls = urls.filter(url => url.trim() !== '');
  const hasValidContent = selectedFiles.length > 0 || validUrls.length > 0;
  const totalItems = selectedFiles.length + validUrls.length;

  const handleUpload = async () => {
    if (!hasValidContent || !selectedUseCase) return;

    await batchUpload.mutateAsync({
      files: selectedFiles,
      urls: validUrls,
      contextFiles: contextFiles,
      useCase: selectedUseCase,
      batchName: batchName || `Batch ${new Date().toLocaleDateString()}`,
      analysisGoals: analysisGoals.trim() || undefined,
      analysisPreferences: analysisPreferences
    });

    // Reset form
    setSelectedFiles([]);
    setContextFiles([]);
    setUrls(['']);
    setBatchName('');
    setAnalysisGoals('');
    setSelectedUseCase('');
    setAnalysisPreferences({
      auto_comparative: true,
      context_integration: true,
      analysis_depth: 'detailed'
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Enhanced Design Analysis</CardTitle>
        <CardDescription>
          Upload multiple design files or analyze website URLs with optional context files for comprehensive AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <BatchInfoSection
          batchName={batchName}
          setBatchName={setBatchName}
          analysisGoals={analysisGoals}
          setAnalysisGoals={setAnalysisGoals}
        />

        <AnalysisPreferencesSection
          analysisPreferences={analysisPreferences}
          setAnalysisPreferences={setAnalysisPreferences}
        />

        {/* Upload Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'files' | 'urls')}>
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
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />
          </TabsContent>

          <TabsContent value="urls" className="space-y-4">
            <URLUploadSection
              urls={urls}
              setUrls={setUrls}
            />
          </TabsContent>
        </Tabs>

        <ContextFilesSection
          contextFiles={contextFiles}
          setContextFiles={setContextFiles}
          isEnabled={analysisPreferences.context_integration}
        />

        <UseCaseSelector
          selectedUseCase={selectedUseCase}
          setSelectedUseCase={setSelectedUseCase}
        />

        <UploadSummary
          selectedFiles={selectedFiles}
          validUrls={validUrls}
          contextFiles={contextFiles}
          analysisGoals={analysisGoals}
          analysisPreferences={analysisPreferences}
          hasValidContent={hasValidContent}
        />

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!hasValidContent || !selectedUseCase || batchUpload.isPending}
          className="w-full"
          size="lg"
        >
          {batchUpload.isPending 
            ? 'Processing...' 
            : `Analyze ${totalItems} Item(s)${totalItems > 1 && analysisPreferences.auto_comparative ? ' (Comparative)' : ''}`
          }
        </Button>
      </CardContent>
    </Card>
  );
};
