
import React, { useState } from 'react';
import { AnalysisChatContainer } from './AnalysisChatContainer';
import { URLInputHandler } from './URLInputHandler';
import { useChatStateContext } from './ChatStateProvider';
import { ChatAttachmentHandlers } from './ChatAttachmentHandlers';

export const MobileChatLayout: React.FC = () => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const {
    messages,
    isAnalyzing,
    message,
    setMessage,
    attachments,
    templates,
    setSelectedTemplateId,
    getCurrentTemplate
  } = useChatStateContext();

  const handleSendMessage = async () => {
    // Implementation will be moved here from UnifiedChatContainer
    console.log('🚀 MOBILE LAYOUT - Send message');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = message.trim().length > 0 || attachments.length > 0;

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
          
          {/* URL Input Handler for Mobile */}
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
