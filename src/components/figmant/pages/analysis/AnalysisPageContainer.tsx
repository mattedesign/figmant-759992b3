
import React from 'react';
import { useChatState } from './ChatStateManager';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { AnalysisListSidebar } from './AnalysisListSidebar';
import { AnalysisDynamicRightPanel } from './AnalysisDynamicRightPanel';
import { PromptTemplateSelector } from './PromptTemplateSelector';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';

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

  const { data: claudePromptTemplates, isLoading: promptsLoading } = useClaudePromptExamples();
  const [lastAnalysisResult, setLastAnalysisResult] = React.useState<any>(null);
  const [selectedAnalysis, setSelectedAnalysis] = React.useState<any>(null);
  const [isHistorySidebarCollapsed, setIsHistorySidebarCollapsed] = React.useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = React.useState(false);

  const handleAnalysisComplete = (result: any) => {
    setLastAnalysisResult(result);
    console.log('Analysis completed:', result);
  };

  const handleAnalysisSelect = (analysis: any) => {
    setSelectedAnalysis(analysis);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  // Determine right panel mode based on current state
  const getRightPanelMode = () => {
    if (lastAnalysisResult || attachments.length > 0) {
      return 'analysis';
    }
    return 'empty';
  };

  // Mock handlers for the AnalysisChatPanel props
  const handleSendMessage = () => {
    // Implementation needed
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentTemplate = () => {
    return claudePromptTemplates?.find(t => t.id === selectedPromptTemplate);
  };

  const handleFileUpload = (file: File) => {
    // Implementation needed
  };

  const handleAddUrl = (url: string) => {
    // Implementation needed
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedPromptTemplate(templateId);
  };

  const handleViewTemplate = (template: any) => {
    console.log('Viewing template:', template);
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  console.log('AnalysisPageContainer - Current attachments:', attachments);

  return (
    <div className="flex h-full">
      {/* Left Panel - History Sidebar */}
      <div className={`bg-white flex-shrink-0 transition-all duration-300 ${
        isHistorySidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        <AnalysisListSidebar
          selectedAnalysis={selectedAnalysis}
          onAnalysisSelect={handleAnalysisSelect}
          onCollapseChange={setIsHistorySidebarCollapsed}
        />
      </div>

      {/* Center Panel - Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Prompt Template Selector - Hidden */}
        <div className="bg-white border-b border-gray-200 p-6 hidden">
          <PromptTemplateSelector
            promptTemplates={claudePromptTemplates}
            promptsLoading={promptsLoading}
            selectedPromptCategory={selectedPromptCategory}
            selectedPromptTemplate={selectedPromptTemplate}
            onPromptCategoryChange={setSelectedPromptCategory}
            onPromptTemplateChange={setSelectedPromptTemplate}
          />
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          <AnalysisChatPanel
            messages={messages}
            isAnalyzing={false}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
            getCurrentTemplate={getCurrentTemplate}
            canSend={message.trim().length > 0}
            handleFileUpload={handleFileUpload}
            showUrlInput={showUrlInput}
            setShowUrlInput={setShowUrlInput}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            handleAddUrl={handleAddUrl}
            handleTemplateSelect={handleTemplateSelect}
            figmantTemplates={claudePromptTemplates || []}
            handleViewTemplate={handleViewTemplate}
            attachments={attachments}
            removeAttachment={removeAttachment}
            onCollapseHistory={() => setIsHistorySidebarCollapsed(true)}
            promptTemplates={claudePromptTemplates}
            selectedPromptCategory={selectedPromptCategory}
            selectedPromptTemplate={selectedPromptTemplate}
          />
        </div>
      </div>

      {/* Right Panel - Analysis Details */}
      <div className={`bg-white flex-shrink-0 transition-all duration-300 ${
        isRightPanelCollapsed ? 'w-16' : 'w-80'
      }`}>
        <AnalysisDynamicRightPanel
          mode={getRightPanelMode()}
          promptTemplates={claudePromptTemplates}
          selectedPromptTemplate={selectedPromptTemplate}
          onPromptTemplateSelect={setSelectedPromptTemplate}
          currentAnalysis={selectedAnalysis}
          attachments={attachments}
          onCollapseChange={setIsRightPanelCollapsed}
          onRemoveAttachment={handleRemoveAttachment}
          lastAnalysisResult={lastAnalysisResult}
        />
      </div>
    </div>
  );
};
