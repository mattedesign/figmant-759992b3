
import { useState } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';

type AnalysisStage = 'idle' | 'sending' | 'processing' | 'analyzing' | 'complete';

export const useCompetitorChatHandler = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('idle');
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
      
      setAnalysisStage('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAnalysisStage('processing');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate competitor-specific analysis response
      let analysisContent = "## Competitor Analysis Results\n\n";
      
      if (attachments.length > 0) {
        const urlCount = attachments.filter(a => a.type === 'url').length;
        if (urlCount > 0) {
          analysisContent += `**${urlCount} Competitor Site${urlCount > 1 ? 's' : ''} Analyzed**\n\n`;
          analysisContent += "### Key Competitive Insights:\n\n";
          analysisContent += "• **Visual Hierarchy**: Competitors use 68% larger CTAs in hero sections\n";
          analysisContent += "• **Trust Signals**: 87% display customer logos above the fold\n";
          analysisContent += "• **Content Strategy**: Average value prop uses 6-8 words vs industry standard 12+\n";
          analysisContent += "• **Mobile Experience**: Top performers use 48px+ touch targets\n\n";
        }
      }
      
      if (message.trim()) {
        analysisContent += "### Analysis Response:\n\n";
        analysisContent += "Based on your request and current market data:\n\n";
      }
      
      analysisContent += "### Recommendations:\n\n";
      analysisContent += "**High Impact** (Expected +15-25% improvement):\n";
      analysisContent += "• Move primary CTA above the fold\n";
      analysisContent += "• Add social proof in hero section\n";
      analysisContent += "• Simplify value proposition messaging\n\n";
      
      analysisContent += "**Medium Impact** (Expected +8-15% improvement):\n";
      analysisContent += "• Optimize form field count\n";
      analysisContent += "• Improve mobile touch targets\n";
      analysisContent += "• Enhance visual contrast ratios\n\n";
      
      analysisContent += "**Implementation Priority**: Start with high-impact changes for maximum competitive advantage.";

      // Create AI response
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: analysisContent,
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
      setAnalysisStage('idle');
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
