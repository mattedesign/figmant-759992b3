
import { useState } from 'react';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';

interface UseMessageHandlerProps {
  message: string;
  setMessage: (message: string) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[]) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  selectedPromptTemplate?: any;
  selectedPromptCategory?: string;
  promptTemplates?: any[];
  onAnalysisComplete?: (analysisResult: any) => void;
}

export const useMessageHandler = ({
  message,
  setMessage,
  attachments,
  setAttachments,
  messages,
  setMessages,
  selectedPromptTemplate,
  selectedPromptCategory,
  promptTemplates,
  onAnalysisComplete
}: UseMessageHandlerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const figmantChat = useFigmantChatAnalysis();

  const canSend = message.trim().length > 0 || attachments.length > 0;

  const handleSendMessage = async () => {
    if (!canSend || isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        attachments: [...attachments],
        timestamp: new Date()
      };

      setMessages([...messages, userMessage]);

      // Call Figmant Chat Analysis with basic parameters
      const result = await figmantChat.mutateAsync({
        message,
        attachments
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      };

      setMessages([...messages, userMessage, assistantMessage]);

      // Call analysis complete callback
      if (onAnalysisComplete) {
        onAnalysisComplete({
          analysis: result.analysis,
          debugInfo: result.debugInfo,
          response: result.analysis
        });
      }

      // Clear input and attachments
      setMessage('');
      setAttachments([]);

      toast({
        title: "Analysis Complete",
        description: "Your design analysis has been generated successfully.",
      });

    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "There was an error generating your analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    isAnalyzing,
    canSend,
    handleSendMessage,
    handleKeyPress
  };
};
