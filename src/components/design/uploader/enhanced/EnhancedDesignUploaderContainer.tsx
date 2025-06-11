
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useBatchUploadDesign } from '@/hooks/useBatchUploadDesign';
import { AnalysisPreferences, FigmantPromptVariables } from '@/types/design';
import { EnhancedDesignUploaderHeader } from './EnhancedDesignUploaderHeader';
import { EnhancedDesignUploaderContent } from './EnhancedDesignUploaderContent';
import { EnhancedDesignUploaderActions } from './EnhancedDesignUploaderActions';

export const EnhancedDesignUploaderContainer = () => {
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
      <EnhancedDesignUploaderHeader />
      <EnhancedDesignUploaderContent
        // Basic form state
        selectedUseCase={selectedUseCase}
        setSelectedUseCase={setSelectedUseCase}
        batchName={batchName}
        setBatchName={setBatchName}
        analysisGoals={analysisGoals}
        setAnalysisGoals={setAnalysisGoals}
        customInstructions={customInstructions}
        setCustomInstructions={setCustomInstructions}
        promptVariables={promptVariables}
        setPromptVariables={setPromptVariables}
        analysisPreferences={analysisPreferences}
        setAnalysisPreferences={setAnalysisPreferences}
        
        // File management
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        contextFiles={contextFiles}
        setContextFiles={setContextFiles}
        urls={urls}
        setUrls={setUrls}
        
        // UI state
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        
        // Computed values
        validUrls={validUrls}
        hasValidContent={hasValidContent}
        buildEnhancedAnalysisGoals={buildEnhancedAnalysisGoals}
      />
      <EnhancedDesignUploaderActions
        hasValidContent={hasValidContent}
        selectedUseCase={selectedUseCase}
        batchUpload={batchUpload}
        totalItems={totalItems}
        analysisPreferences={analysisPreferences}
        onUpload={handleUpload}
      />
    </Card>
  );
};
