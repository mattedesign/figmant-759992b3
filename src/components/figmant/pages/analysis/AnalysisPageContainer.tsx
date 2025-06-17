
import React from 'react';
import { useChatState } from './ChatStateManager';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { AnalysisRightPanel } from './AnalysisRightPanel';
import { PromptTemplateSelector } from './PromptTemplateSelector';
import { usePromptTemplates } from '@/hooks/usePromptTemplates';

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
  } = useChatState({
    onAttachmentsChange: (newAttachments) => {
      console.log('Attachments updated in chat state:', newAttachments);
    }
  });

  const { data: promptTemplates, isLoading: promptsLoading } = usePromptTemplates();
  const [lastAnalysisResult, setLastAnalysisResult] = React.useState<any>(null);

  const handleAnalysisComplete = (result: any) => {
    setLastAnalysisResult(result);
    console.log('Analysis completed:', result);
  };

  console.log('AnalysisPageContainer - Current attachments:', attachments);

  return (
    <div className="flex h-full">
      {/* Left Panel - Prompt Template Selector */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <PromptTemplateSelector
          promptTemplates={promptTemplates}
          promptsLoading={promptsLoading}
          selectedPromptCategory={selectedPromptCategory}
          selectedPromptTemplate={selectedPromptTemplate}
          onPromptCategoryChange={setSelectedPromptCategory}
          onPromptTemplateChange={setSelectedPromptTemplate}
        />
      </div>

      {/* Center Panel - Chat Interface */}
      <div className="flex-1">
        <AnalysisChatPanel
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
          selectedPromptTemplate={promptTemplates?.find(t => t.id === selectedPromptTemplate)}
          selectedPromptCategory={selectedPromptCategory}
          promptTemplates={promptTemplates}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>

      {/* Right Panel - Analysis Results & Attachments */}
      <AnalysisRightPanel
        analysis={lastAnalysisResult}
        attachments={attachments}
      />
    </div>
  );
};
