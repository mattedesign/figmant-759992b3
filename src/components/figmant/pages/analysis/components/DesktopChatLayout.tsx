
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { AnalysisChatContainer } from './AnalysisChatContainer';
import { AnalysisNavigationSidebar } from './AnalysisNavigationSidebar';
import { URLInputHandler } from './URLInputHandler';
import { useChatStateContext } from './ChatStateProvider';
import { ChatAttachmentHandlers } from './ChatAttachmentHandlers';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { ChatMessage } from '@/components/design/DesignChatInterface';

export const DesktopChatLayout: React.FC = () => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [isAssetsPanelVisible, setIsAssetsPanelVisible] = useState(true);

  const {
    messages,
    setMessages,
    isAnalyzing,
    message,
    setMessage,
    attachments,
    setAttachments,
    templates,
    setSelectedTemplateId,
    getCurrentTemplate
  } = useChatStateContext();

  const chatAnalysis = useFigmantChatAnalysis();

  const handleSendMessage = async () => {
    console.log('🚀 DESKTOP LAYOUT - Send message');
    
    if (!message.trim() && attachments.length === 0) {
      console.log('No content to send');
      return;
    }

    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        attachments: attachments.length > 0 ? attachments : undefined,
        timestamp: new Date()
      };

      // Add user message to state
      if (setMessages) {
        setMessages(prev => [...prev, userMessage]);
      }

      // Send to analysis API
      const result = await chatAnalysis.mutateAsync({
        message,
        attachments,
        template: getCurrentTemplate()
      });

      // Add AI response
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      };

      if (setMessages) {
        setMessages(prev => [...prev, aiMessage]);
      }

      // Clear input
      if (setMessage) {
        setMessage('');
      }
      
      // Clear attachments if setAttachments is available
      if (setAttachments) {
        setAttachments([]);
      }
      
    } catch (error) {
      console.error('Send message error:', error);
    }
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
    console.log('🎯 DESKTOP LAYOUT - View template:', template);
  };

  const handleToggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
  };

  const handleViewAttachment = (attachment: any) => {
    console.log('View attachment:', attachment);
  };

  return (
    <ChatAttachmentHandlers>
      {(attachmentHandlers) => (
        <div className="h-full flex gap-4">
          {/* Main Chat Container */}
          <div className="flex-1 min-w-0 relative">
            <AnalysisChatContainer
              messages={messages}
              isAnalyzing={isAnalyzing || chatAnalysis.isPending}
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
              onCancelUrl={() => {}}
              onTemplateSelect={handleTemplateSelect}
              availableTemplates={templates}
              onViewTemplate={handleViewTemplate}
              attachments={attachments}
              onRemoveAttachment={attachmentHandlers.removeAttachment}
            />
            
            {/* URL Input Handler */}
            {showUrlInput && (
              <div className="absolute top-0 left-0 right-0 z-10 p-4">
                <URLInputHandler
                  showUrlInput={showUrlInput}
                  onClose={() => setShowUrlInput(false)}
                  attachments={attachments}
                  onAttachmentAdd={attachmentHandlers.handleAttachmentAdd}
                  onAttachmentUpdate={attachmentHandlers.handleAttachmentUpdate}
                />
              </div>
            )}
          </div>

          {/* Analysis Assets Panel */}
          {isAssetsPanelVisible && (
            <div className="flex-shrink-0 w-72">
              <AnalysisNavigationSidebar
                messages={messages}
                attachments={attachments}
                onRemoveAttachment={attachmentHandlers.removeAttachment}
                onViewAttachment={handleViewAttachment}
                lastAnalysisResult={lastAnalysisResult}
                isCollapsed={false}
                onToggleCollapse={() => setIsAssetsPanelVisible(!isAssetsPanelVisible)}
              />
            </div>
          )}

          {/* Toggle Button for Assets Panel */}
          {!isAssetsPanelVisible && (
            <div className="flex-shrink-0 flex items-start pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAssetsPanelVisible(true)}
                className="h-8 w-8 p-0"
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </ChatAttachmentHandlers>
  );
};
