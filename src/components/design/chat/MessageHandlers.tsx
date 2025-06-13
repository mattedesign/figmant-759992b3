
import { useToast } from '@/hooks/use-toast';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';

const MESSAGE_SEND_TIMEOUT = 10000; // 10 seconds for validation

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
    console.log('=== SEND MESSAGE HANDLER START ===');
    console.log('Message:', message.trim());
    console.log('Attachments:', attachments.map(att => ({ 
      id: att.id, 
      name: att.name, 
      status: att.status 
    })));

    if (!message.trim() && attachments.length === 0) {
      console.log('No message or attachments, aborting');
      return;
    }

    // Check if any attachments are still processing with timeout
    const processingAttachments = attachments.filter(att => 
      att.status === 'uploading' || att.status === 'processing'
    );
    
    if (processingAttachments.length > 0) {
      console.log('Found processing attachments:', processingAttachments.map(att => att.id));
      
      // Wait for processing to complete or timeout
      const startTime = Date.now();
      let timeoutReached = false;
      
      const checkProcessingComplete = () => {
        return new Promise<boolean>((resolve) => {
          const checkInterval = setInterval(() => {
            const currentTime = Date.now();
            if (currentTime - startTime > MESSAGE_SEND_TIMEOUT) {
              clearInterval(checkInterval);
              timeoutReached = true;
              resolve(false);
              return;
            }
            
            // Check current state of attachments
            const stillProcessing = attachments.filter(att => 
              att.status === 'uploading' || att.status === 'processing'
            );
            
            if (stillProcessing.length === 0) {
              clearInterval(checkInterval);
              resolve(true);
            }
          }, 500);
        });
      };
      
      const processingComplete = await checkProcessingComplete();
      
      if (!processingComplete || timeoutReached) {
        console.log('Processing timeout or failed');
        toast({
          variant: "destructive",
          title: "Upload Timeout",
          description: "Some files are taking too long to process. Please remove failed uploads and try again.",
        });
        return;
      }
    }

    // Check for failed uploads after processing check
    const failedAttachments = attachments.filter(att => att.status === 'error');
    if (failedAttachments.length > 0) {
      console.log('Found failed attachments:', failedAttachments.map(att => att.id));
      toast({
        variant: "destructive",
        title: "Upload Errors",
        description: `${failedAttachments.length} file(s) failed to upload. Please remove them or retry before sending.`,
      });
      return;
    }

    // Ensure all attachments are properly uploaded
    const uploadedAttachments = attachments.filter(att => att.status === 'uploaded');
    if (attachments.length > 0 && uploadedAttachments.length !== attachments.length) {
      console.log('Not all attachments are uploaded properly');
      toast({
        variant: "destructive",
        title: "Upload Incomplete",
        description: "Please wait for all files to finish uploading before sending.",
      });
      return;
    }

    console.log('All validations passed, proceeding with message send');

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      attachments: [...uploadedAttachments]
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    const currentAttachments = [...uploadedAttachments];
    
    // Clear input immediately
    setMessage('');
    setAttachments([]);

    try {
      console.log('Starting chat analysis...');
      const result = await analyzeWithChat.mutateAsync({
        message: currentMessage,
        attachments: currentAttachments
      });

      console.log('Chat analysis completed successfully');
      
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
      
      toast({
        title: "Analysis Complete",
        description: "Your message has been analyzed successfully.",
      });

    } catch (error) {
      console.error('Chat analysis failed:', error);
      
      // Store the error for debugging
      setLastAnalysisResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        attachments: currentAttachments.map(att => ({ 
          id: att.id, 
          name: att.name, 
          status: att.status 
        }))
      });
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing your request. Please check your files and try again, or contact support if the issue persists.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
    
    console.log('=== SEND MESSAGE HANDLER COMPLETE ===');
  };

  return {
    handleSendMessage,
    analyzeWithChat
  };
};
