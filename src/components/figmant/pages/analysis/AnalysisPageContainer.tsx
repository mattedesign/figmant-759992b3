
import React from 'react';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { AnalysisPageLayout } from './components/AnalysisPageLayout';
import { useAnalysisPageState } from './hooks/useAnalysisPageState';

interface AnalysisPageContainerProps {
  selectedTemplate?: any;
}

export const AnalysisPageContainer: React.FC<AnalysisPageContainerProps> = ({ 
  selectedTemplate 
}) => {
  const { data: claudePromptTemplates = [], isLoading: promptsLoading } = useClaudePromptExamples();
  const analysisState = useAnalysisPageState();

  console.log('📊 ANALYSIS PAGE CONTAINER - State:', {
    templatesLoaded: claudePromptTemplates.length > 0,
    templatesCount: claudePromptTemplates.length,
    promptsLoading,
    selectedTemplate: analysisState.selectedPromptTemplate,
    attachmentsCount: analysisState.attachments.length
  });

  // If templates are still loading, show loading state
  if (promptsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analysis templates...</p>
        </div>
      </div>
    );
  }

  const selectedTemplateData = claudePromptTemplates.find(t => t.id === analysisState.selectedPromptTemplate);

  return (
    <AnalysisPageLayout
      message={analysisState.message}
      setMessage={analysisState.setMessage}
      messages={analysisState.messages}
      setMessages={analysisState.setMessages}
      attachments={analysisState.attachments}
      setAttachments={analysisState.setAttachments}
      urlInput={analysisState.urlInput}
      setUrlInput={analysisState.setUrlInput}
      showUrlInput={analysisState.showUrlInput}
      setShowUrlInput={analysisState.setShowUrlInput}
      selectedPromptTemplate={selectedTemplateData}
      selectedPromptCategory={analysisState.selectedPromptCategory}
      promptTemplates={claudePromptTemplates}
      onAnalysisComplete={analysisState.handleAnalysisComplete}
      lastAnalysisResult={analysisState.lastAnalysisResult}
      isRightPanelCollapsed={analysisState.isRightPanelCollapsed}
      selectedPromptTemplateId={analysisState.selectedPromptTemplate}
      setSelectedPromptTemplate={analysisState.setSelectedPromptTemplate}
      onRemoveAttachment={analysisState.handleRemoveAttachment}
    />
  );
};
