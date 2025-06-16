
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFigmantPromptTemplates, useBestFigmantPrompt } from '@/hooks/useFigmantChatAnalysis';
import { useChatState } from './analysis/ChatStateManager';
import { useCategoryColors } from './analysis/useCategoryColors';
import { MobileAnalysisLayout } from './analysis/MobileAnalysisLayout';
import { DesktopAnalysisLayout } from './analysis/DesktopAnalysisLayout';

interface AnalysisPageProps {
  selectedTemplate?: any;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ selectedTemplate }) => {
  const {
    message,
    setMessage,
    messages,
    setMessages,
    attachments,
    setAttachments,
    selectedPromptCategory,
    setSelectedPromptCategory,
    selectedPromptTemplate,
    setSelectedPromptTemplate,
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput
  } = useChatState();

  const { data: promptTemplates, isLoading: promptsLoading } = useFigmantPromptTemplates();
  const { data: bestPrompt } = useBestFigmantPrompt(selectedPromptCategory);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const { getCategoryColor } = useCategoryColors();
  const isMobile = useIsMobile();

  // Handle template from navigation
  useEffect(() => {
    if (selectedTemplate) {
      setSelectedPromptCategory(selectedTemplate.category);
      setSelectedPromptTemplate(selectedTemplate.id);
    }
  }, [selectedTemplate, setSelectedPromptCategory, setSelectedPromptTemplate]);

  const handleAnalysisComplete = (analysisResult: any) => {
    setLastAnalysisResult(analysisResult);
  };

  const clearTemplateSelection = () => {
    setSelectedPromptCategory('');
    setSelectedPromptTemplate('');
  };

  const handleNewAnalysis = () => {
    // Clear current state to start fresh
    setMessages([]);
    setAttachments([]);
    setMessage('');
    setUrlInput('');
    setShowUrlInput(false);
    clearTemplateSelection();
    setLastAnalysisResult(null);
  };

  const currentTemplate = promptTemplates?.find(t => t.id === selectedPromptTemplate);

  // Common chat panel props
  const chatPanelProps = {
    message,
    setMessage,
    messages,
    setMessages,
    attachments,
    setAttachments,
    urlInput,
    setUrlInput,
    showUrlInput,
    setShowUrlInput,
    selectedPromptTemplate: currentTemplate,
    selectedPromptCategory,
    promptTemplates,
    onAnalysisComplete: handleAnalysisComplete
  };

  if (isMobile) {
    return (
      <MobileAnalysisLayout
        promptTemplates={promptTemplates}
        promptsLoading={promptsLoading}
        selectedPromptCategory={selectedPromptCategory}
        selectedPromptTemplate={selectedPromptTemplate}
        onPromptCategoryChange={setSelectedPromptCategory}
        onPromptTemplateChange={setSelectedPromptTemplate}
        bestPrompt={bestPrompt}
        currentTemplate={currentTemplate}
        showTemplateDetails={showTemplateDetails}
        onToggleTemplateDetails={() => setShowTemplateDetails(!showTemplateDetails)}
        onClearTemplateSelection={clearTemplateSelection}
        getCategoryColor={getCategoryColor}
        chatPanelProps={chatPanelProps}
      />
    );
  }

  return (
    <DesktopAnalysisLayout
      onNewAnalysis={handleNewAnalysis}
      chatPanelProps={chatPanelProps}
      promptTemplates={promptTemplates}
      selectedPromptCategory={selectedPromptCategory}
      selectedPromptTemplate={selectedPromptTemplate}
      onPromptCategoryChange={setSelectedPromptCategory}
      onPromptTemplateChange={setSelectedPromptTemplate}
    />
  );
};
