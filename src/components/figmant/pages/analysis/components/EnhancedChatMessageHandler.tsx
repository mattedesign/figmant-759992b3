
import React from 'react';
import { useChatStateContext } from './ChatStateProvider';

interface EnhancedChatMessageHandlerProps {
  children: (props: {
    handleSendMessage: () => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
    canSend: boolean;
  }) => React.ReactNode;
}

export const EnhancedChatMessageHandler: React.FC<EnhancedChatMessageHandlerProps> = ({ children }) => {
  const { 
    message, 
    attachments, 
    analyzeWithClaude,
    createContextualPrompt,
    getCurrentTemplate,
    setMessages,
    setMessage,
    setAttachments
  } = useChatStateContext();

  const canSend = message.trim().length > 0 || attachments.length > 0;

  const handleSendMessage = async () => {
    if (!canSend) return;

    try {
      // Create contextual prompt with enhanced features
      const currentTemplate = getCurrentTemplate();
      const contextualMessage = createContextualPrompt(message, currentTemplate);

      // Add user message
      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: message,
        attachments: [...attachments],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // Analyze with Claude
      const result = await analyzeWithClaude({
        message: contextualMessage,
        attachments
      });

      // Add assistant response
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: result.analysis || result.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Clear input
      setMessage('');
      setAttachments([]);

    } catch (error) {
      console.error('Enhanced message sending failed:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return <>{children({ handleSendMessage, handleKeyPress, canSend })}</>;
};
