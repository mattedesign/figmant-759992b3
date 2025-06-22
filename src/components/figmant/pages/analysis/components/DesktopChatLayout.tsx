
import React, { useState, useCallback } from 'react';
import { ChatMessages } from '../ChatMessages';
import { MessageInputSection } from '../MessageInputSection';
import { AnalysisNavigationSidebar } from './AnalysisNavigationSidebar';
import { AnalysisRightPanel } from '../AnalysisRightPanel';
import { EnhancedChatMessageHandler } from './EnhancedChatMessageHandler';
import { ContextIndicator } from './ContextIndicator';
import { useChatStateContext } from './ChatStateProvider';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

export const DesktopChatLayout: React.FC = () => {
  const { 
    conversationContext, 
    autoSaveState,
    messages, 
    attachments,
    message,
    setMessage,
    currentSessionId,
    isSessionInitialized,
    saveConversation
  } = useChatStateContext();

  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleRemoveAttachment = useCallback((id: string) => {
    console.log('🗑️ DESKTOP CHAT LAYOUT - Remove attachment:', id);
  }, []);

  const handleViewAttachment = useCallback((attachment: any) => {
    console.log('👁️ DESKTOP CHAT LAYOUT - View attachment:', attachment);
    if (attachment.type === 'url' && attachment.url) {
      window.open(attachment.url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const handleToggleUrlInput = useCallback(() => {
    setShowUrlInput(!showUrlInput);
  }, [showUrlInput]);

  const handleToggleRightPanel = useCallback(() => {
    setShowRightPanel(!showRightPanel);
  }, [showRightPanel]);

  const handleManualSave = useCallback(async () => {
    try {
      await saveConversation(messages);
    } catch (error) {
      console.error('Manual save failed:', error);
    }
  }, [saveConversation, messages]);

  console.log('🖥️ DESKTOP CHAT LAYOUT - Rendering with enhanced context:', {
    sessionId: currentSessionId,
    isInitialized: isSessionInitialized,
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    hasHistoricalContext: !!conversationContext.historicalContext,
    hasAttachmentContext: conversationContext.attachmentContext?.length > 0,
    tokenEstimate: conversationContext.tokenEstimate,
    autoSaveStatus: autoSaveState.status,
    showRightPanel
  });

  return (
    <div className="flex h-full w-full">
      {/* Left Sidebar - Analysis Navigation */}
      <div className="w-80 border-r border-gray-200 bg-gray-50">
        <AnalysisNavigationSidebar
          messages={messages}
          attachments={attachments}
          onRemoveAttachment={handleRemoveAttachment}
          onViewAttachment={handleViewAttachment}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Context Indicator */}
        <div className="p-3 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <ContextIndicator
              hasHistoricalContext={!!conversationContext.historicalContext}
              hasAttachmentContext={conversationContext.attachmentContext?.length > 0}
              messageCount={messages.length}
              tokenEstimate={conversationContext.tokenEstimate}
              autoSaveStatus={autoSaveState.status}
              lastSaved={autoSaveState.lastSaved}
            />
            
            {/* Right Panel Toggle */}
            <div className="flex items-center gap-2">
              {autoSaveState.status === 'error' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualSave}
                  className="text-xs"
                >
                  Manual Save
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleRightPanel}
                className="p-2"
                title={showRightPanel ? 'Hide Details Panel' : 'Show Details Panel'}
              >
                {showRightPanel ? (
                  <PanelRightClose className="h-4 w-4" />
                ) : (
                  <PanelRightOpen className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages} />
        </div>

        {/* Enhanced Input Section */}
        <div className="border-t border-gray-200 bg-white">
          <EnhancedChatMessageHandler>
            {({ handleSendMessage, handleKeyPress, canSend }) => (
              <MessageInputSection
                message={message}
                onMessageChange={setMessage}
                onSendMessage={handleSendMessage}
                onKeyPress={handleKeyPress}
                onToggleUrlInput={handleToggleUrlInput}
                isAnalyzing={false}
                canSend={canSend}
              />
            )}
          </EnhancedChatMessageHandler>
        </div>
      </div>

      {/* Enhanced Right Panel - Collapsible */}
      {showRightPanel && (
        <div className="border-l border-gray-200 bg-gray-50">
          <AnalysisRightPanel 
            currentSessionId={currentSessionId}
            conversationContext={{
              sessionId: conversationContext.sessionId,
              messages: conversationContext.messages,
              totalMessages: conversationContext.totalMessages || 0,
              sessionAttachments: conversationContext.sessionAttachments || [],
              sessionLinks: conversationContext.sessionLinks || [],
              historicalContext: conversationContext.historicalContext,
              attachmentContext: conversationContext.attachmentContext,
              tokenEstimate: conversationContext.tokenEstimate
            }}
            autoSaveStatus={autoSaveState.status}
            messageCount={autoSaveState.messageCount}
            lastSaved={autoSaveState.lastSaved}
            onRemoveAttachment={handleRemoveAttachment}
            onViewAttachment={handleViewAttachment}
          />
        </div>
      )}
    </div>
  );
};
