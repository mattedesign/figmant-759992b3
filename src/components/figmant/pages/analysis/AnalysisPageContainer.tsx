
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFigmantPromptTemplates, useBestFigmantPrompt } from '@/hooks/useFigmantChatAnalysis';
import { useChatState } from './ChatStateManager';
import { useCategoryColors } from './useCategoryColors';
import { MobileAnalysisLayout } from './MobileAnalysisLayout';
import { AnalysisDesktopLayout } from './AnalysisDesktopLayout';
import { AnalysisDetailView } from './AnalysisDetailView';

interface AnalysisPageContainerProps {
  selectedTemplate?: any;
}

export const AnalysisPageContainer: React.FC<AnalysisPageContainerProps> = ({ selectedTemplate }) => {
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
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [rightPanelMode, setRightPanelMode] = useState<'templates' | 'analysis'>('templates');
  const [showAnalysisDetail, setShowAnalysisDetail] = useState(false);
  const { getCategoryColor } = useCategoryColors();
  const isMobile = useIsMobile();

  // Handle template from navigation
  useEffect(() => {
    if (selectedTemplate) {
      setSelectedPromptCategory(selectedTemplate.category);
      setSelectedPromptTemplate(selectedTemplate.id);
    }
  }, [selectedTemplate, setSelectedPromptCategory, setSelectedPromptTemplate]);

  // Switch to analysis mode when analysis starts or completes
  useEffect(() => {
    if (messages.length > 0 || lastAnalysisResult) {
      setRightPanelMode('analysis');
    } else {
      setRightPanelMode('templates');
    }
  }, [messages.length, lastAnalysisResult]);

  const handleAnalysisComplete = (analysisResult: any) => {
    setLastAnalysisResult(analysisResult);
    setRightPanelMode('analysis');
  };

  const handleAnalysisSelect = (analysis: any) => {
    setSelectedAnalysis(analysis);
  };

  const handlePromptTemplateSelect = (templateId: string) => {
    setSelectedPromptTemplate(templateId);
    const template = promptTemplates?.find(t => t.id === templateId);
    if (template) {
      setSelectedPromptCategory(template.category);
    }
  };

  const handleAnalysisDetailClick = () => {
    setShowAnalysisDetail(true);
  };

  const handleBackFromDetail = () => {
    setShowAnalysisDetail(false);
  };

  const clearTemplateSelection = () => {
    setSelectedPromptCategory('');
    setSelectedPromptTemplate('');
  };

  const currentTemplate = promptTemplates?.find(t => t.id === selectedPromptTemplate);
  const currentAnalysis = lastAnalysisResult || {
    title: 'Current Analysis',
    status: messages.length > 0 ? 'In Progress' : 'Ready',
    score: lastAnalysisResult?.score
  };

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
        showTemplateDetails={false}
        onToggleTemplateDetails={() => {}}
        onClearTemplateSelection={clearTemplateSelection}
        getCategoryColor={getCategoryColor}
        chatPanelProps={chatPanelProps}
      />
    );
  }

  if (showAnalysisDetail) {
    return (
      <AnalysisDetailView
        selectedAnalysis={selectedAnalysis}
        onAnalysisSelect={handleAnalysisSelect}
        onBackFromDetail={handleBackFromDetail}
      />
    );
  }

  // Desktop layout
  return (
    <AnalysisDesktopLayout
      selectedAnalysis={selectedAnalysis}
      onAnalysisSelect={handleAnalysisSelect}
      chatPanelProps={chatPanelProps}
      rightPanelMode={rightPanelMode}
      promptTemplates={promptTemplates}
      selectedPromptCategory={selectedPromptCategory}
      selectedPromptTemplate={selectedPromptTemplate}
      onPromptTemplateSelect={handlePromptTemplateSelect}
      onPromptCategoryChange={setSelectedPromptCategory}
      currentAnalysis={currentAnalysis}
      attachments={attachments}
      onAnalysisClick={handleAnalysisDetailClick}
      onBackClick={rightPanelMode === 'analysis' ? () => setRightPanelMode('templates') : undefined}
    />
  );
};
