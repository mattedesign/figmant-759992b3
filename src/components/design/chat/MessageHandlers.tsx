
import { useToast } from '@/hooks/use-toast';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';

export const useMessageHandlers = () => {
  const { toast } = useToast();
  const { analyzeWithChat } = useChatAnalysis();

  const handleSendMessage = async (
    message: string,
    attachments: ChatAttachment[],
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    setLastAnalysisResult: React.Dispatch<React.SetStateAction<any>>
  ) => {
    if (!message.trim() && attachments.length === 0) return;

    // Check if any attachments are still processing
    const processingAttachments = attachments.filter(att => 
      att.status === 'uploading' || att.status === 'processing'
    );
    if (processingAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Upload in Progress",
        description: "Please wait for all files to finish processing and uploading before sending.",
      });
      return;
    }

    // Check for failed uploads
    const failedAttachments = attachments.filter(att => att.status === 'error');
    if (failedAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Upload Errors",
        description: "Please remove or retry failed uploads before sending.",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    const currentAttachments = [...attachments];
    
    // Clear input
    setMessage('');
    setAttachments([]);

    try {
      const result = await analyzeWithChat.mutateAsync({
        message: currentMessage,
        attachments: currentAttachments
      });

      // Store the analysis result for debugging
      setLastAnalysisResult(result);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date(),
        uploadIds: result.uploadIds,
        batchId: result.batchId
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat analysis failed:', error);
      
      // Store the error for debugging
      setLastAnalysisResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing your request. Please try again or check if your files uploaded correctly.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return {
    handleSendMessage,
    analyzeWithChat
  };
};
