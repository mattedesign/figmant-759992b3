
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { PremiumAnalysisWizard } from '../../premium-analysis/PremiumAnalysisWizard';
import { AnalysisChatContainer } from './AnalysisChatContainer';

interface AnalysisTabContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messages: ChatMessage[];
  isAnalyzing: boolean;
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  getCurrentTemplate: () => any;
  canSend: boolean;
  handleFileUpload: (files: FileList) => void;
  showUrlInput: boolean;
  setShowUrlInput: (show: boolean) => void;
  urlInput: string;
  setUrlInput: (url: string) => void;
  handleAddUrl: (urlInput: string) => void;
  handleTemplateSelect: (templateId: string) => void;
  figmantTemplates: any[];
  handleViewTemplate: (template: any) => void;
  attachments: ChatAttachment[];
  removeAttachment: (id: string) => void;
}

export const AnalysisTabContent: React.FC<AnalysisTabContentProps> = ({
  activeTab,
  setActiveTab,
  messages,
  isAnalyzing,
  message,
  setMessage,
  handleSendMessage,
  handleKeyPress,
  getCurrentTemplate,
  canSend,
  handleFileUpload,
  showUrlInput,
  setShowUrlInput,
  urlInput,
  setUrlInput,
  handleAddUrl,
  handleTemplateSelect,
  figmantTemplates,
  handleViewTemplate,
  attachments,
  removeAttachment
}) => {
  const handleToggleUrlInput = () => setShowUrlInput(!showUrlInput);
  const handleCancelUrl = () => setShowUrlInput(false);
  
  const handleAddUrlWithInput = () => {
    if (urlInput.trim()) {
      handleAddUrl(urlInput);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  console.log('🎯 ANALYSIS TAB CONTENT - Rendering with:', {
    activeTab,
    messagesCount: messages.length,
    templatesCount: figmantTemplates.length,
    attachmentsCount: attachments.length
  });

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Chat Tab Content */}
      {activeTab === 'chat' && (
        <div className="h-full flex flex-col min-h-0">
          <AnalysisChatContainer
            messages={messages}
            isAnalyzing={isAnalyzing}
            message={message}
            setMessage={setMessage}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            getCurrentTemplate={getCurrentTemplate}
            canSend={canSend}
            onFileUpload={handleFileUpload}
            onToggleUrlInput={handleToggleUrlInput}
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            onAddUrl={handleAddUrlWithInput}
            onCancelUrl={handleCancelUrl}
            onTemplateSelect={handleTemplateSelect}
            availableTemplates={figmantTemplates}
            onViewTemplate={handleViewTemplate}
            attachments={attachments}
            onRemoveAttachment={removeAttachment}
          />
        </div>
      )}

      {/* Wizard Tab Content */}
      {activeTab === 'wizard' && (
        <div className="h-full flex flex-col min-h-0">
          <PremiumAnalysisWizard />
        </div>
      )}
    </div>
  );
};
