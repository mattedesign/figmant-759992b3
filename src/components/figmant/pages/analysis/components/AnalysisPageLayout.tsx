
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { AnalysisTabContent } from './AnalysisTabContent';
import { useFileUploadHandler } from '../useFileUploadHandler';
import { useAnalysisPageState } from '../hooks/useAnalysisPageState';
import { AnalysisChatHeader } from '../AnalysisChatHeader';
import { URLAttachmentHandler } from './URLAttachmentHandler';

interface AnalysisPageLayoutProps {
  message: string;
  setMessage: (message: string) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[]) => void;
  urlInput: string;
  setUrlInput: (url: string) => void;
  showUrlInput: boolean;
  setShowUrlInput: (show: boolean) => void;
  selectedPromptTemplate?: any;
  selectedPromptCategory: string;
  promptTemplates?: any[];
  onAnalysisComplete?: (result: any) => void;
  lastAnalysisResult?: any;
  isRightPanelCollapsed: boolean;
  selectedPromptTemplateId: string;
  setSelectedPromptTemplate: (templateId: string) => void;
  onRemoveAttachment: (id: string) => void;
}

export const AnalysisPageLayout: React.FC<AnalysisPageLayoutProps> = ({
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
  selectedPromptTemplate,
  promptTemplates = [],
  onAnalysisComplete,
  setSelectedPromptTemplate,
  onRemoveAttachment
}) => {
  const [activeTab, setActiveTab] = React.useState<string>('chat');
  const { handleFileUpload } = useFileUploadHandler(setAttachments);

  const getCurrentTemplate = () => {
    return selectedPromptTemplate;
  };

  const handleTemplateSelect = (templateId: string) => {
    console.log('🎯 LAYOUT - Template selected:', templateId);
    setSelectedPromptTemplate(templateId);
  };

  const handleViewTemplate = (template: any) => {
    console.log('🎯 LAYOUT - View template:', template);
    // This would open a modal or details view
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header with Tabs */}
      <div className="px-6 pt-6 pb-3 bg-transparent flex-shrink-0">
        <AnalysisChatHeader 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        <URLAttachmentHandler
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          setShowUrlInput={setShowUrlInput}
          attachments={attachments}
          setAttachments={setAttachments}
        >
          {(handleAddUrl) => (
            <AnalysisTabContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              messages={messages}
              isAnalyzing={false}
              message={message}
              setMessage={setMessage}
              handleSendMessage={() => {}} // Will be handled by chat handler
              handleKeyPress={() => {}}
              getCurrentTemplate={getCurrentTemplate}
              canSend={message.trim().length > 0 || attachments.length > 0}
              handleFileUpload={handleFileUpload}
              showUrlInput={showUrlInput}
              setShowUrlInput={setShowUrlInput}
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              handleAddUrl={handleAddUrl}
              handleTemplateSelect={handleTemplateSelect}
              figmantTemplates={promptTemplates}
              handleViewTemplate={handleViewTemplate}
              attachments={attachments}
              removeAttachment={removeAttachment}
            />
          )}
        </URLAttachmentHandler>
      </div>
    </div>
  );
};
