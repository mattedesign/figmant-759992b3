
import React from 'react';
import { ChatMessages } from '../ChatMessages';
import { MessageInputSection } from '../MessageInputSection';
import { AnalysisNavigationSidebar } from './AnalysisNavigationSidebar';
import { AnalysisRightPanel } from './AnalysisRightPanel';
import { EnhancedChatMessageHandler } from './EnhancedChatMessageHandler';
import { ContextIndicator } from './ContextIndicator';
import { useEnhancedChatStateContext } from './EnhancedChatStateProvider';

export const DesktopChatLayout: React.FC = () => {
  const { 
    conversationContext, 
    messages, 
    attachments,
    message,
    setMessage,
    showUrlInput,
    setShowUrlInput
  } = useEnhancedChatStateContext();

  const handleRemoveAttachment = (id: string) => {
    console.log('Remove attachment:', id);
    // Implementation will be added by the context provider
  };

  const handleViewAttachment = (attachment: any) => {
    console.log('View attachment:', attachment);
    // Implementation will be added by the context provider
  };

  const handleToggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
  };

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
        {/* Context Indicator */}
        <div className="p-2 border-b border-gray-100 bg-white">
          <ContextIndicator
            hasHistoricalContext={conversationContext.historicalContext.length > 0}
            hasAttachmentContext={conversationContext.attachmentContext.length > 0}
            messageCount={conversationContext.currentMessages.length}
            tokenEstimate={conversationContext.tokenEstimate}
          />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages} />
        </div>

        {/* Input Section */}
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

      {/* Right Panel - Analysis Details */}
      <div className="w-80 border-l border-gray-200 bg-gray-50">
        <AnalysisRightPanel 
          conversationContext={conversationContext}
          onRemoveAttachment={handleRemoveAttachment}
          onViewAttachment={handleViewAttachment}
        />
      </div>
    </div>
  );
};
