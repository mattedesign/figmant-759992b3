
import { useState } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';

export const useCompetitorChatHandler = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Please enter a message or attach competitor URLs.",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStage('analyzing');

    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        attachments: [...attachments],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // Simulate analysis stages
      setAnalysisStage('processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysisStage('comparing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAnalysisStage('generating');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create AI response
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I've analyzed the competitor data you provided. Here's what I found:\n\n• Key competitive advantages identified\n• Performance comparison metrics\n• Recommendations for optimization\n\nBased on the analysis, here are the top 3 opportunities for improvement...`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setMessage('');
      setAttachments([]);

      toast({
        title: "Analysis Complete",
        description: "Competitor analysis has been completed successfully.",
      });

    } catch (error) {
      console.error('Competitor analysis failed:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing competitors. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = (message.trim().length > 0 || attachments.length > 0) && !isAnalyzing;

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
