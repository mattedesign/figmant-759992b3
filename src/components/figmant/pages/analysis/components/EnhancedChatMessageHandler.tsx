
import React, { ReactNode } from 'react';
import { ChatMessage } from '@/components/design/DesignChatInterface';
import { useEnhancedChatStateContext } from './EnhancedChatStateProvider';

interface EnhancedChatMessageHandlerProps {
  children: (handlers: EnhancedMessageHandlers) => ReactNode;
}

interface EnhancedMessageHandlers {
  handleSendMessage: () => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  canSend: boolean;
}

export const EnhancedChatMessageHandler: React.FC<EnhancedChatMessageHandlerProps> = ({ children }) => {
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
    currentSessionId,
    saveMessageAttachments,
    conversationContext,
    toast
  } = useEnhancedChatStateContext();

  const handleSendMessage = async () => {
    console.log('🔥 ENHANCED CHAT MESSAGE HANDLER - Send button clicked!');
    console.log('🔥 ENHANCED CHAT MESSAGE HANDLER - Current state:', {
      messageLength: message.length,
      attachmentsCount: attachments.length,
      hasAnalyzeFunction: !!analyzeWithClaude,
      hasContext: conversationContext.historicalContext.length > 0,
      sessionId: currentSessionId
    });

    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No content to analyze",
        description: "Please enter a message or attach files/URLs.",
      });
      return;
    }

    console.log('🚀 ENHANCED MESSAGE HANDLER - Sending message with enhanced context:', {
      messageLength: message.length,
      attachmentsCount: attachments.length,
      contextLength: conversationContext.historicalContext.length,
      tokenEstimate: conversationContext.tokenEstimate
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
        title: "Enhanced Analysis Starting",
        description: "Your message and context are being analyzed with full conversation history.",
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

      console.log('🔥 ENHANCED CHAT MESSAGE HANDLER - About to call enhanced analyzeWithClaude...');
      
      const result = await analyzeWithClaude({
        message,
        attachments: analysisAttachments,
        template,
        sessionId: currentSessionId
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

      // Show enhanced completion message
      toast({
        title: result.contextUsed ? "Enhanced Analysis Complete" : "Analysis Complete",
        description: result.contextUsed 
          ? "Your analysis was completed using full conversation context and history."
          : "Your analysis was completed successfully.",
      });

    } catch (error) {
      console.error('🔥 ENHANCED CHAT MESSAGE HANDLER - Analysis error:', error);
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Your conversation history has been preserved.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Enhanced Analysis Failed",
        description: "The analysis failed, but your conversation history is preserved for retry.",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = message.trim().length > 0 || attachments.length > 0;

  const handlers: EnhancedMessageHandlers = {
    handleSendMessage,
    handleKeyPress,
    canSend
  };

  return <>{children(handlers)}</>;
};
