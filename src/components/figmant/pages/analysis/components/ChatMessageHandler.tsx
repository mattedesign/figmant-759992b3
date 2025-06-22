
import React, { ReactNode } from 'react';
import { ChatMessage } from '@/types/chat';
import { useChatStateContext } from './ChatStateProvider';

interface ChatMessageHandlerProps {
  children: (handlers: MessageHandlers) => ReactNode;
}

interface MessageHandlers {
  handleSendMessage: () => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  canSend: boolean;
}

export const ChatMessageHandler: React.FC<ChatMessageHandlerProps> = ({ children }) => {
  const {
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    analyzeWithClaude,
    getCurrentTemplate,
    isSessionInitialized,
    saveMessageAttachments,
    toast
  } = useChatStateContext();

  const handleSendMessage = async () => {
    console.log('🔥 CHAT MESSAGE HANDLER - Send button clicked!');
    console.log('🔥 CHAT MESSAGE HANDLER - Current state:', {
      messageLength: message.length,
      attachmentsCount: attachments.length,
      hasAnalyzeFunction: !!analyzeWithClaude,
      existingMessagesCount: messages.length
    });

    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No content to analyze",
        description: "Please enter a message or attach files/URLs.",
      });
      return;
    }

    console.log('🚀 MESSAGE HANDLER - Sending message with attachments:', {
      messageLength: message.length,
      attachmentsCount: attachments.length,
      existingMessages: messages.length
    });

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setMessage('');

    // Save message attachments to persistent storage
    if (isSessionInitialized && userMessage.attachments) {
      saveMessageAttachments(userMessage);
      
      toast({
        title: "Message Saved",
        description: "Your message and attachments have been saved to this chat session.",
      });
    }

    try {
      const template = getCurrentTemplate();
      
      const analysisAttachments = attachments.map(att => ({
        id: att.id,
        type: att.type,
        name: att.name,
        uploadPath: att.uploadPath,
        url: att.url
      }));

      console.log('🔥 CHAT MESSAGE HANDLER - About to call analyzeWithClaude...');
      
      const result = await analyzeWithClaude({
        message,
        attachments: analysisAttachments,
        template
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Clear attachments after successful analysis
      setAttachments([]);

      console.log('✅ CHAT MESSAGE HANDLER - Analysis completed, total messages:', newMessages.length + 1);

    } catch (error) {
      console.error('🔥 CHAT MESSAGE HANDLER - Analysis error:', error);
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Your conversation history has been preserved.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = message.trim().length > 0 || attachments.length > 0;

  const handlers: MessageHandlers = {
    handleSendMessage,
    handleKeyPress,
    canSend
  };

  return <>{children(handlers)}</>;
};
