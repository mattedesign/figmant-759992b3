
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { AnalysisChatContainer } from './AnalysisChatContainer';
import { AnalysisNavigationSidebar } from './AnalysisNavigationSidebar';
import { URLInputHandler } from './URLInputHandler';
import { useChatStateContext } from './ChatStateProvider';
import { ChatAttachmentHandlers } from './ChatAttachmentHandlers';

export const DesktopChatLayout: React.FC = () => {
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
        <div className="h-full flex gap-4 overflow-hidden">
          {/* Main Chat Container - Fixed height with proper flex layout */}
          <div className="flex-1 min-w-0 relative flex flex-col h-full">
            <div className="flex-1 min-h-0 relative">
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
            
            {/* URL Input Handler - Positioned absolutely but within container */}
            {showUrlInput && (
              <div className="absolute top-4 left-4 right-4 z-10 bg-white rounded-lg shadow-lg border">
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
            <div className="flex-shrink-0 w-72 h-full overflow-hidden">
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
