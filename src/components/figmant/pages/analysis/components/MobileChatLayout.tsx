
import React from 'react';
import { ChatMessages } from '../ChatMessages';
import { MessageInputSection } from '../MessageInputSection';
import { useChatStateContext } from './ChatStateProvider';

export const MobileChatLayout: React.FC = () => {
  const { 
    messages, 
    message,
    setMessage,
    attachments,
    conversationContext,
    autoSaveState
  } = useChatStateContext();

  console.log('📱 MOBILE CHAT LAYOUT - Rendering with enhanced context:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    autoSaveStatus: autoSaveState.status
  });

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages messages={messages} />
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-200 bg-white p-4">
        <MessageInputSection
          message={message}
          onMessageChange={setMessage}
          onSendMessage={() => {}}
          onKeyPress={() => {}}
          onToggleUrlInput={() => {}}
          isAnalyzing={false}
          canSend={message.trim().length > 0}
        />
      </div>
    </div>
  );
};
