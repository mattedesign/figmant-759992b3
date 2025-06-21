
import React from 'react';
import { DesignChatInterface, ChatMessage, ChatAttachment } from '../DesignChatInterface';

interface EnhancedChatInterfaceProps {
  onSendMessage: (message: string, attachments: ChatAttachment[]) => void;
  messages: ChatMessage[];
  isProcessing?: boolean;
  placeholder?: string;
  className?: string;
}

export const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isProcessing = false,
  placeholder = "Describe your design or ask for analysis...",
  className = ""
}) => {
  const handleClearChat = () => {
    // This would typically clear messages, but since we don't have access to setMessages,
    // we'll leave this as a no-op for now. Parent components should handle this if needed.
    console.log('Clear chat requested');
  };

  return (
    <DesignChatInterface
      onSendMessage={onSendMessage}
      onClearChat={handleClearChat}
      messages={messages}
      isProcessing={isProcessing}
      placeholder={placeholder}
      className={className}
    />
  );
};
