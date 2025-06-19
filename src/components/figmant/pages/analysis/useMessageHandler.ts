
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
  chatMode = 'analyze'
}: UseMessageHandlerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const figmantChat = useFigmantChatAnalysis();

  // Update canSend logic based on mode
  const getCanSend = () => {
    if (chatMode === 'chat') {
      // Chat mode requires text input only
      return message.trim().length > 0 && !isAnalyzing;
    } else {
      // Analyze mode can use files, URLs, or text
      const hasContent = message.trim().length > 0 || attachments.length > 0;
      return hasContent && !isAnalyzing;
    }
  };

  const canSend = getCanSend();

  const handleSendMessage = async () => {
    if (!canSend) return;

    setIsAnalyzing(true);

    try {
      // Add user message first
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        attachments: chatMode === 'analyze' ? [...attachments] : undefined,
        timestamp: new Date(),
        mode: chatMode
      };

      setMessages([...messages, userMessage]);

      // Handle different modes
      let result;
      if (chatMode === 'chat') {
        // Chat mode - lightweight conversational responses
        result = await handleChatMode();
      } else {
        // Analyze mode - full analysis with credit deduction
        result = await handleAnalysisMode();
      }

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis || result.response || 'Response generated successfully.',
        timestamp: new Date()
      };

      setMessages([...messages, userMessage, assistantMessage]);

      // Call analysis complete callback
      if (onAnalysisComplete) {
        onAnalysisComplete({
          analysis: result.analysis || result.response,
          debugInfo: result.debugInfo,
          response: result.analysis || result.response
        });
      }

      // Clear input and attachments only on success
      setMessage('');
      if (chatMode === 'analyze') {
        setAttachments([]);
      }

      toast({
        title: chatMode === 'analyze' ? "Analysis Complete" : "Response Generated",
        description: chatMode === 'analyze' 
          ? "Your design analysis has been generated successfully."
          : "Chat response has been generated successfully.",
      });

    } catch (error: any) {
      console.error('Message handling failed:', error);
      
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

  const handleChatMode = async () => {
    // For chat mode, we still use the figmant chat analysis but with lighter processing
    // In the future, this could be a separate lighter endpoint
    const analysisParams = {
      message,
      attachments: [], // Chat mode doesn't use attachments
      mode: 'chat',
      template: null // No templates in chat mode
    };

    return await figmantChat.mutateAsync(analysisParams);
  };

  const handleAnalysisMode = async () => {
    // Full analysis mode with credit deduction and template usage
    const analysisParams = {
      message,
      attachments,
      mode: 'analyze',
      template: selectedPromptTemplate
    };

    return await figmantChat.mutateAsync(analysisParams);
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
