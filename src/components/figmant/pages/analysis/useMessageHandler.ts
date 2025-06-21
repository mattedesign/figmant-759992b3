
import { useState } from 'react';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';
import { convertToLegacyAttachments } from '@/utils/attachmentTypeConverter';

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
  chatMode?: 'chat' | 'analyze';
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
  onAnalysisComplete,
  chatMode = 'chat'
}: UseMessageHandlerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const figmantChat = useFigmantChatAnalysis();

  const canSend = message.trim().length > 0 || attachments.length > 0;

  const handleSendMessage = async () => {
    if (!canSend || isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      // Add user message first
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        attachments: [...attachments],
        timestamp: new Date(),
        mode: chatMode
      };

      setMessages([...messages, userMessage]);

      // Convert attachments to legacy format for API compatibility
      const legacyAttachments = convertToLegacyAttachments(attachments);

      // Modify analysis call based on mode
      const analysisParams = {
        message,
        attachments: legacyAttachments,
        mode: chatMode,
        template: chatMode === 'analyze' ? selectedPromptTemplate : null
      };

      const result = await figmantChat.mutateAsync(analysisParams);

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

      // Clear input and attachments only on success
      setMessage('');
      setAttachments([]);

      toast({
        title: chatMode === 'analyze' ? "Analysis Complete" : "Response Generated",
        description: chatMode === 'analyze' 
          ? "Your design analysis has been generated successfully."
          : "Chat response has been generated successfully.",
      });

    } catch (error: any) {
      console.error('Analysis failed:', error);
      
      // Check if it's a credit-related error
      if (error.message?.includes('credits') || error.message?.includes('subscription')) {
        toast({
          title: "Insufficient Credits",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: chatMode === 'analyze' ? "Analysis Failed" : "Chat Failed",
          description: error.message || "There was an error generating your response. Please try again.",
          variant: "destructive"
        });
      }
      
      // Remove the user message that was added if analysis fails
      setMessages(messages);
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
