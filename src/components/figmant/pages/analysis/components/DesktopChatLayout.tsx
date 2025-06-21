
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
        <div className="flex h-full bg-background overflow-hidden">
          {/* Main Chat Container - Uses flex layout with constrained height */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
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
              onCancelUrl={() => {}}
              onTemplateSelect={handleTemplateSelect}
              availableTemplates={templates}
              onViewTemplate={handleViewTemplate}
              attachments={attachments}
              onRemoveAttachment={attachmentHandlers.removeAttachment}
            />
          </div>

          {/* Analysis Assets Panel */}
          {isAssetsPanelVisible && (
            <div className="w-72 border-l border-border flex-shrink-0 overflow-hidden">
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

          {/* URL Input Handler - Highest z-index overlay */}
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
