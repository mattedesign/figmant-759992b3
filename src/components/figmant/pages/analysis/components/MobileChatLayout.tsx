
import React, { useState, useEffect } from 'react';
import { AnalysisChatContainer } from './AnalysisChatContainer';
import { URLInputHandler } from './URLInputHandler';
import { useChatStateContext } from './ChatStateProvider';
import { ChatAttachmentHandlers } from './ChatAttachmentHandlers';

export const MobileChatLayout: React.FC = () => {
  console.log('🔍 RENDERING: MobileChatLayout');
  
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100vh');

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

  // Handle iOS Safari viewport changes
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        setViewportHeight(`${window.visualViewport.height}px`);
      } else {
        setViewportHeight(`${window.innerHeight}px`);
      }
    };

    handleResize();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Prevent body scroll when URL input is open
  useEffect(() => {
    if (showUrlInput) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [showUrlInput]);

  const handleSendMessage = async () => {
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
        <div 
          className="fixed inset-0 bg-background"
          style={{ height: viewportHeight }}
        >
          {/* Main Chat Container - Uses absolute positioning for bulletproof layout */}
          <div className="absolute inset-0">
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
              showUrlInput={false}
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
          </div>
          
          {/* URL Input Handler - True overlay with highest z-index */}
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
