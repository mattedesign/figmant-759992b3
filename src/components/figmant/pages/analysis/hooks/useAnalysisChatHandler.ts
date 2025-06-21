
import { useState } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useToast } from '@/hooks/use-toast';

export const useAnalysisChatHandler = (
  message: string,
  setMessage: (message: string) => void,
  messages: ChatMessage[],
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void,
  attachments: ChatAttachment[],
  setAttachments: (attachments: ChatAttachment[] | ((prev: ChatAttachment[]) => ChatAttachment[])) => void,
  selectedTemplate?: any
) => {
  const { toast } = useToast();
  const analysisQuery = useFigmantChatAnalysis();

  const handleSendMessage = async () => {
    // Add debugging at the beginning of handleSendMessage
    console.log('🔥 SEND MESSAGE - Button clicked, starting analysis...');
    
    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Please enter a message or attach files before sending.",
      });
      return;
    }

    console.log('🚀 ANALYSIS CHAT - Sending message with:', {
      messageLength: message.length,
      attachmentsCount: attachments.length,
      selectedTemplate: selectedTemplate?.title || 'None'
    });

    // Create user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      attachments: [...attachments],
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages([...messages, userMessage]);
    
    // Clear input
    const currentMessage = message;
    const currentAttachments = [...attachments];
    setMessage('');
    setAttachments([]);

    try {
      // Build enhanced message with template context
      let enhancedMessage = currentMessage;
      if (selectedTemplate) {
        enhancedMessage = `Using template: ${selectedTemplate.title}\n\nTemplate context: ${selectedTemplate.original_prompt}\n\nUser request: ${currentMessage}`;
      }

      // Call analysis
      const result = await analysisQuery.mutateAsync({
        message: enhancedMessage,
        attachments: currentAttachments,
        template: selectedTemplate
      });

      // Add AI response
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis || result.response || 'Analysis completed.',
        timestamp: new Date()
      };

      setMessages((prev: ChatMessage[]) => [...prev, aiMessage]);

      toast({
        title: "Analysis Complete",
        description: "Your design analysis has been completed.",
      });

    } catch (error) {
      console.error('🚀 ANALYSIS CHAT - Error:', error);
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I encountered an error while analyzing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      };

      setMessages((prev: ChatMessage[]) => [...prev, errorMessage]);

      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = (message.trim().length > 0 || attachments.length > 0) && !analysisQuery.isPending;

  return {
    handleSendMessage,
    handleKeyPress,
    canSend,
    isAnalyzing: analysisQuery.isPending
  };
};
