
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
  promptUsed?: string;
}

interface UseMessageHandlerProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  attachments: ChatAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  selectedPromptTemplate: string;
  selectedPromptCategory: string;
  promptTemplates?: any[];
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
  promptTemplates
}: UseMessageHandlerProps) => {
  const { toast } = useToast();
  const { analyzeWithFigmantChat } = useFigmantChatAnalysis();

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    // Check for any failed attachments
    const failedAttachments = attachments.filter(att => att.status === 'error');
    if (failedAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Upload Errors",
        description: "Please remove failed uploads before sending.",
      });
      return;
    }

    // Check for any processing attachments
    const processingAttachments = attachments.filter(att => 
      att.status === 'uploading' || att.status === 'processing'
    );
    if (processingAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Processing Files",
        description: "Please wait for all files to finish uploading.",
      });
      return;
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Store current values before clearing
    const currentMessage = message;
    const currentAttachments = [...attachments];
    const promptTemplate = selectedPromptTemplate ? 
      promptTemplates?.find(p => p.id === selectedPromptTemplate)?.original_prompt : 
      undefined;

    // Clear input
    setMessage('');
    setAttachments([]);

    try {
      // Call the analysis
      const result = await analyzeWithFigmantChat.mutateAsync({
        message: currentMessage,
        attachments: currentAttachments,
        promptTemplate,
        analysisType: selectedPromptCategory || 'general_analysis'
      });

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date(),
        promptUsed: result.promptUsed
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Analysis failed:', error);
      
      // Create error message
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing your request. Please check your files and try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = !analyzeWithFigmantChat.isPending && (Boolean(message.trim()) || attachments.length > 0);

  return {
    handleSendMessage,
    handleKeyPress,
    canSend,
    isAnalyzing: analyzeWithFigmantChat.isPending
  };
};
