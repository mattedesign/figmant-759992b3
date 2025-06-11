
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileImage, Globe } from 'lucide-react';
import { useBatchUploadDesign } from '@/hooks/useBatchUploadDesign';
import { AnalysisPreferences, FigmantPromptVariables } from '@/types/design';
import { BatchInfoSection } from './uploader/BatchInfoSection';
import { AnalysisPreferencesSection } from './uploader/AnalysisPreferencesSection';
import { FileUploadSection } from './uploader/FileUploadSection';
import { URLUploadSection } from './uploader/URLUploadSection';
import { ContextFilesSection } from './uploader/ContextFilesSection';
import { EnhancedUseCaseSelector } from './uploader/EnhancedUseCaseSelector';
import { UploadSummary } from './uploader/UploadSummary';

export const EnhancedDesignUploader = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [contextFiles, setContextFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>(['']);
  const [batchName, setBatchName] = useState<string>('');
  const [analysisGoals, setAnalysisGoals] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'files' | 'urls'>('files');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [promptVariables, setPromptVariables] = useState<FigmantPromptVariables>({});
  const [analysisPreferences, setAnalysisPreferences] = useState<AnalysisPreferences>({
    auto_comparative: true,
    context_integration: true,
    analysis_depth: 'detailed'
  });
  
  const batchUpload = useBatchUploadDesign();

  const validUrls = urls.filter(url => url.trim() !== '');
  const hasValidContent = selectedFiles.length > 0 || validUrls.length > 0;
  const totalItems = selectedFiles.length + validUrls.length;

  const buildEnhancedAnalysisGoals = () => {
    let enhancedGoals = analysisGoals;
    
    if (customInstructions) {
      enhancedGoals += `\n\nAdditional Instructions: ${customInstructions}`;
    }

    // Add prompt variables context
    const variableContext = [];
    if (promptVariables.designType) variableContext.push(`Design Type: ${promptVariables.designType}`);
    if (promptVariables.industry) variableContext.push(`Industry: ${promptVariables.industry}`);
    if (promptVariables.targetAudience) variableContext.push(`Target Audience: ${promptVariables.targetAudience}`);
    if (promptVariables.businessGoals) variableContext.push(`Business Goals: ${promptVariables.businessGoals}`);
    if (promptVariables.conversionGoals) variableContext.push(`Conversion Goals: ${promptVariables.conversionGoals}`);
    if (promptVariables.testHypothesis) variableContext.push(`Test Hypothesis: ${promptVariables.testHypothesis}`);
    
    if (promptVariables.competitorUrls && promptVariables.competitorUrls.length > 0) {
      variableContext.push(`Competitors: ${promptVariables.competitorUrls.join(', ')}`);
    }

    if (variableContext.length > 0) {
      enhancedGoals += `\n\nContext Variables:\n${variableContext.join('\n')}`;
    }

    return enhancedGoals.trim() || undefined;
  };

  const handleUpload = async () => {
    if (!hasValidContent || !selectedUseCase) return;

    await batchUpload.mutateAsync({
      files: selectedFiles,
      urls: validUrls,
      contextFiles: contextFiles,
      useCase: selectedUseCase,
      batchName: batchName || `Batch ${new Date().toLocaleDateString()}`,
      analysisGoals: buildEnhancedAnalysisGoals(),
      analysisPreferences: analysisPreferences
    });

    // Reset form
    setSelectedFiles([]);
    setContextFiles([]);
    setUrls(['']);
    setBatchName('');
    setAnalysisGoals('');
    setCustomInstructions('');
    setPromptVariables({});
    setSelectedUseCase('');
    setAnalysisPreferences({
      auto_comparative: true,
      context_integration: true,
      analysis_depth: 'detailed'
    });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Figmant.ai Enhanced Design Analysis</CardTitle>
        <CardDescription>
          Upload multiple design files or analyze website URLs with AI-powered insights using professional UX analysis frameworks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <BatchInfoSection
          batchName={batchName}
          setBatchName={setBatchName}
          analysisGoals={analysisGoals}
          setAnalysisGoals={setAnalysisGoals}
        />

        <EnhancedUseCaseSelector
          selectedUseCase={selectedUseCase}
          setSelectedUseCase={setSelectedUseCase}
          promptVariables={promptVariables}
          setPromptVariables={setPromptVariables}
          customInstructions={customInstructions}
          setCustomInstructions={setCustomInstructions}
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

        <UploadSummary
          selectedFiles={selectedFiles}
          validUrls={validUrls}
          contextFiles={contextFiles}
          analysisGoals={buildEnhancedAnalysisGoals() || ''}
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
