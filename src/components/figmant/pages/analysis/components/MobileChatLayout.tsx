
import React, { useState } from 'react';
import { AnalysisChatContainer } from './AnalysisChatContainer';
import { URLInputHandler } from './URLInputHandler';
import { useChatStateContext } from './ChatStateProvider';
import { ChatAttachmentHandlers } from './ChatAttachmentHandlers';
import { useMessageHandler } from '../useMessageHandler';

export const MobileChatLayout: React.FC = () => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const {
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    templates,
    setSelectedTemplateId,
    getCurrentTemplate
  } = useChatStateContext();

  // Use the message handler hook for proper send functionality
  const {
    isAnalyzing,
    canSend,
    handleSendMessage: sendMessage,
    handleKeyPress
  } = useMessageHandler({
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    selectedPromptTemplate: getCurrentTemplate(),
    chatMode: 'analyze'
  });

  const handleSendMessage = async () => {
    console.log('🚀 MOBILE LAYOUT - Send message triggered');
    await sendMessage();
  };

  const handleTemplateSelect = (templateId: string) => {
    if (setSelectedTemplateId) {
      setSelectedTemplateId(templateId);
    }
  };

  const handleViewTemplate = (template: any) => {
    console.log('🎯 MOBILE LAYOUT - View template:', template);
  };

  const handleToggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
  };

  return (
    <ChatAttachmentHandlers>
      {(attachmentHandlers) => (
        <div className="h-full">
          <AnalysisChatContainer
            messages={messages}
            isAnalyzing={isAnalyzing}
            message={message}
            setMessage={setMessage}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            getCurrentTemplate={getCurrentTemplate}
            canSend={canSend}
            onFileUpload={attachmentHandlers.handleFileUpload}
            onToggleUrlInput={handleToggleUrlInput}
            showUrlInput={showUrlInput}
            urlInput=""
            setUrlInput={() => {}}
            onAddUrl={() => {}}
            onCancelUrl={() => setShowUrlInput(false)}
            onTemplateSelect={handleTemplateSelect}
            availableTemplates={templates}
            onViewTemplate={handleViewTemplate}
            attachments={attachments}
            onRemoveAttachment={attachmentHandlers.removeAttachment}
          />
          
          <URLInputHandler
            showUrlInput={showUrlInput}
            onClose={() => setShowUrlInput(false)}
            attachments={attachments}
            onAttachmentAdd={attachmentHandlers.handleAttachmentAdd}
            onAttachmentUpdate={attachmentHandlers.handleAttachmentUpdate}
          />
        </div>
      )}
    </ChatAttachmentHandlers>
  );
};
