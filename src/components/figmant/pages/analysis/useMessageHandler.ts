
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

      setMessages(prev => [...prev, userMessage]);

      // Determine prompt to use
      let promptToUse = '';
      if (selectedPromptTemplate) {
        promptToUse = selectedPromptTemplate.prompt_text;
      } else if (selectedPromptCategory && promptTemplates) {
        const categoryTemplate = promptTemplates.find(
          t => t.category === selectedPromptCategory
        );
        if (categoryTemplate) {
          promptToUse = categoryTemplate.prompt_text;
        }
      }

      // Call Figmant Chat Analysis
      const result = await figmantChat.mutateAsync({
        message,
        attachments,
        promptTemplate: promptToUse,
        analysisType: selectedPromptCategory || 'general'
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date(),
        uploadIds: result.uploadIds
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Call analysis complete callback
      if (onAnalysisComplete) {
        onAnalysisComplete({
          analysis: result.analysis,
          uploadIds: result.uploadIds,
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

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating your analysis. Please try again.",
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
