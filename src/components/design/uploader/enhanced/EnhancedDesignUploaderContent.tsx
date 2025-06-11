
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileImage, Globe } from 'lucide-react';
import { AnalysisPreferences, FigmantPromptVariables } from '@/types/design';
import { BatchInfoSection } from '../BatchInfoSection';
import { EnhancedUseCaseSelector } from '../EnhancedUseCaseSelector';
import { AnalysisPreferencesSection } from '../AnalysisPreferencesSection';
import { FileUploadSection } from '../FileUploadSection';
import { URLUploadSection } from '../URLUploadSection';
import { ContextFilesSection } from '../ContextFilesSection';
import { UploadSummary } from '../UploadSummary';

interface EnhancedDesignUploaderContentProps {
  // Basic form state
  selectedUseCase: string;
  setSelectedUseCase: (value: string) => void;
  batchName: string;
  setBatchName: (value: string) => void;
  analysisGoals: string;
  setAnalysisGoals: (value: string) => void;
  customInstructions: string;
  setCustomInstructions: (value: string) => void;
  promptVariables: FigmantPromptVariables;
  setPromptVariables: (value: FigmantPromptVariables) => void;
  analysisPreferences: AnalysisPreferences;
  setAnalysisPreferences: (value: AnalysisPreferences) => void;
  
  // File management
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  contextFiles: File[];
  setContextFiles: (files: File[]) => void;
  urls: string[];
  setUrls: (urls: string[]) => void;
  
  // UI state
  activeTab: 'files' | 'urls';
  setActiveTab: (tab: 'files' | 'urls') => void;
  
  // Computed values
  validUrls: string[];
  hasValidContent: boolean;
  buildEnhancedAnalysisGoals: () => string | undefined;
}

export const EnhancedDesignUploaderContent: React.FC<EnhancedDesignUploaderContentProps> = ({
  selectedUseCase,
  setSelectedUseCase,
  batchName,
  setBatchName,
  analysisGoals,
  setAnalysisGoals,
  customInstructions,
  setCustomInstructions,
  promptVariables,
  setPromptVariables,
  analysisPreferences,
  setAnalysisPreferences,
  selectedFiles,
  setSelectedFiles,
  contextFiles,
  setContextFiles,
  urls,
  setUrls,
  activeTab,
  setActiveTab,
  validUrls,
  hasValidContent,
  buildEnhancedAnalysisGoals
}) => {
  return (
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
    </CardContent>
  );
};
