
import { useState, useCallback } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useToast } from '@/hooks/use-toast';
import { convertToLegacyAttachments } from '@/utils/attachmentTypeConverter';

export const useCompetitorChatHandler = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'idle' | 'sending' | 'processing' | 'analyzing' | 'complete'>('idle');
  
  const { toast } = useToast();
  const chatAnalysis = useFigmantChatAnalysis();

  const showProgressToast = (stage: string, description: string) => {
    toast({
      title: stage,
      description: description,
      duration: 2000,
    });
  };

  const handleSendMessage = useCallback(async () => {
    console.log('🔥 COMPETITOR CHAT - Send button clicked!', {
      message: message.trim(),
      attachmentCount: attachments.length
    });

    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Please enter a message or attach competitor URLs before sending.",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStage('sending');

    try {
      // Create user message immediately
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        attachments: [...attachments],
        timestamp: new Date()
      };

      // Add user message to chat
      setMessages(prev => [...prev, userMessage]);

      // Clear inputs immediately
      const currentMessage = message;
      const currentAttachments = [...attachments];
      setMessage('');
      setAttachments([]);

      // Show progress feedback
      showProgressToast("Sending Message", "Preparing your competitor analysis request...");
      
      setAnalysisStage('processing');
      console.log('🔥 COMPETITOR CHAT - Calling analysis API...');

      // Simulate processing delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysisStage('analyzing');
      showProgressToast("Processing", "Analyzing competitor data with AI...");

      // Convert attachments to legacy format for API compatibility
      const legacyAttachments = convertToLegacyAttachments(currentAttachments);

      // Call the analysis API
      const result = await chatAnalysis.mutateAsync({
        message: currentMessage,
        attachments: legacyAttachments,
        template: { category: 'competitor' } // Force competitor analysis
      });

      console.log('🔥 COMPETITOR CHAT - Analysis result:', result);

      setAnalysisStage('complete');

      // Add AI response
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis || result.response || 'Analysis completed successfully.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      toast({
        title: "Analysis Complete",
        description: "Your competitor analysis has been generated successfully.",
        duration: 4000,
      });

    } catch (error) {
      console.error('🔥 COMPETITOR CHAT - Error:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('idle');
    }
  }, [message, attachments, chatAnalysis, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const canSend = !isAnalyzing && (message.trim().length > 0 || attachments.length > 0);

  return {
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    isAnalyzing,
    analysisStage,
    handleSendMessage,
    handleKeyPress,
    canSend
  };
};
