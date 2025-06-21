
import React, { useState } from 'react';
import { DesignChatInterface, ChatMessage, ChatAttachment } from './DesignChatInterface';
import { useMessageHandlers } from './chat/MessageHandlers';

export const AdvancedDesignAnalysisPageContent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const { handleSendMessage } = useMessageHandlers();

  const onSendMessage = async (message: string, attachments: ChatAttachment[]) => {
    // Create a temporary setter function for the message handlers
    const setMessage = () => {};
    const setAttachments = () => {};
    
    await handleSendMessage(
      message,
      attachments,
      setMessages,
      setMessage,
      setAttachments,
      setLastAnalysisResult
    );
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <DesignChatInterface
      onSendMessage={onSendMessage}
      onClearChat={handleClearChat}
      messages={messages}
      isProcessing={false}
      placeholder="Describe your design or ask for analysis..."
    />
  );
};
