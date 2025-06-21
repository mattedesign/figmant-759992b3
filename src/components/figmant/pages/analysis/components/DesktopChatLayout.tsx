
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { AnalysisChatContainer } from './AnalysisChatContainer';
import { AnalysisNavigationSidebar } from './AnalysisNavigationSidebar';
import { URLInputHandler } from './URLInputHandler';
import { useChatStateContext } from './ChatStateProvider';
import { ChatAttachmentHandlers } from './ChatAttachmentHandlers';

export const DesktopChatLayout: React.FC = () => {
  console.log('🔍 RENDERING: DesktopChatLayout');
  
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [isAssetsPanelVisible, setIsAssetsPanelVisible] = useState(true);

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
    console.log('🚀 DESKTOP LAYOUT - Send message');
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
        <div className="h-screen flex overflow-hidden bg-background">
          {/* Main Chat Container - Bulletproof viewport layout with full height */}
          <div className="flex-1 min-w-0 h-full">
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
              showUrlInput={false} // Never inline - always overlay
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
          </div>

          {/* Analysis Assets Panel - Fixed width, independent scrolling */}
          {isAssetsPanelVisible && (
            <div className="flex-shrink-0 w-72 h-full border-l border-border">
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

          {/* Toggle Button for Assets Panel - Floating when collapsed */}
          {!isAssetsPanelVisible && (
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAssetsPanelVisible(true)}
                className="h-10 w-10 p-0 bg-background shadow-lg border-border"
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* URL Input Handler - True overlay with fixed positioning */}
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
