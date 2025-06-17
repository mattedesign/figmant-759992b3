
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChatAttachment, ChatMessage } from '@/components/design/DesignChatInterface';
import { ChatMessages } from './ChatMessages';
import { AttachmentPreview } from './AttachmentPreview';
import { URLInputSection } from './URLInputSection';
import { AnalysisChatHeader } from './AnalysisChatHeader';
import { AnalysisChatTabs } from './AnalysisChatTabs';
import { AnalysisChatInput } from './AnalysisChatInput';
import { AnalysisChatPlaceholder } from './AnalysisChatPlaceholder';
import { useAttachmentHandlers } from '@/components/design/chat/hooks/useAttachmentHandlers';
import { useFileUploadHandler } from './useFileUploadHandler';
import { useMessageHandler } from './useMessageHandler';

interface AnalysisChatPanelProps {
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
  selectedPromptCategory?: string;
  promptTemplates?: any[];
  onAnalysisComplete?: (result: any) => void;
}

export const AnalysisChatPanel: React.FC<AnalysisChatPanelProps> = ({
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
  selectedPromptCategory,
  promptTemplates,
  onAnalysisComplete
}) => {
  const [activeTab, setActiveTab] = useState("chat");
  
  const {
    addUrlAttachment,
    removeAttachment
  } = useAttachmentHandlers(attachments, setAttachments, setUrlInput, setShowUrlInput);
  const {
    handleFileUpload
  } = useFileUploadHandler(setAttachments);

  // Use the real message handler that connects to Claude AI
  const {
    isAnalyzing,
    canSend,
    handleSendMessage,
    handleKeyPress
  } = useMessageHandler({
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    selectedPromptTemplate,
    selectedPromptCategory,
    promptTemplates,
    onAnalysisComplete
  });

  const handleAddUrl = () => {
    addUrlAttachment(urlInput);
  };

  const handleFileUploadFromInput = (files: FileList) => {
    Array.from(files).forEach(handleFileUpload);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Only show messages when there are actual messages, not when user is typing
  const hasMessages = messages.length > 0;
  
  return (
    <div className="h-full flex flex-col bg-[#F9FAFB]">
      {/* Header with Tabs moved to top */}
      <div className="p-6 bg-transparent">
        <AnalysisChatHeader />
        
        <AnalysisChatTabs 
          showUrlInput={showUrlInput} 
          setShowUrlInput={setShowUrlInput} 
          onFileSelect={() => {}} // This is no longer used since upload is in the input
          onFileUpload={handleFileUploadFromInput}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Messages Area or Placeholder - only show when chat tab is active */}
      {activeTab === "chat" && (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          {hasMessages ? (
            <div className="p-6">
              <ChatMessages messages={messages} isAnalyzing={isAnalyzing} />
            </div>
          ) : (
            <AnalysisChatPlaceholder />
          )}
        </div>
      )}

      {/* Templates tab content is handled by AnalysisChatTabs component */}
      {activeTab === "templates" && (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB] p-6">
          {/* Tab content is rendered within AnalysisChatTabs */}
        </div>
      )}

      {/* URL Input */}
      {showUrlInput && (
        <URLInputSection 
          urlInput={urlInput} 
          setUrlInput={setUrlInput} 
          onAddUrl={handleAddUrl} 
          onCancel={() => setShowUrlInput(false)} 
        />
      )}

      {/* Chat Input - only show when chat tab is active */}
      {activeTab === "chat" && (
        <AnalysisChatInput 
          message={message} 
          setMessage={setMessage} 
          onSendMessage={handleSendMessage} 
          onKeyPress={handleKeyPress} 
          selectedPromptTemplate={selectedPromptTemplate} 
          canSend={canSend} 
          isAnalyzing={isAnalyzing} 
          onFileUpload={handleFileUploadFromInput} 
          onToggleUrlInput={() => setShowUrlInput(!showUrlInput)} 
        />
      )}
    </div>
  );
};
