
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
  const { data: claudePromptTemplates, isLoading: promptsLoading } = useClaudePromptExamples();
  const {
    message,
    setMessage,
    messages,
    setMessages,
    attachments,
    setAttachments,
    selectedPromptCategory,
    selectedPromptTemplate,
    setSelectedPromptTemplate,
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput,
    lastAnalysisResult,
    isRightPanelCollapsed,
    handleAnalysisComplete,
    handleRemoveAttachment
  } = useAnalysisPageState();

  console.log('AnalysisPageContainer - Current attachments:', attachments);

  return (
    <AnalysisPageLayout
      message={message}
      setMessage={setMessage}
      messages={messages}
      setMessages={setMessages}
      attachments={attachments}
      setAttachments={setAttachments}
      urlInput={urlInput}
      setUrlInput={setUrlInput}
      showUrlInput={showUrlInput}
      setShowUrlInput={setShowUrlInput}
      selectedPromptTemplate={claudePromptTemplates?.find(t => t.id === selectedPromptTemplate)}
      selectedPromptCategory={selectedPromptCategory}
      promptTemplates={claudePromptTemplates}
      onAnalysisComplete={handleAnalysisComplete}
      lastAnalysisResult={lastAnalysisResult}
      isRightPanelCollapsed={isRightPanelCollapsed}
      selectedPromptTemplateId={selectedPromptTemplate}
      setSelectedPromptTemplate={setSelectedPromptTemplate}
      onRemoveAttachment={handleRemoveAttachment}
    />
  );
};
