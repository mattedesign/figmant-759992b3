
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

    // Immediate validation of current attachment states
    const currentProcessingAttachments = attachments.filter(att => 
      att.status === 'uploading' || att.status === 'processing'
    );
    
    const currentFailedAttachments = attachments.filter(att => att.status === 'error');
    
    console.log('Current processing attachments:', currentProcessingAttachments.length);
    console.log('Current failed attachments:', currentFailedAttachments.length);

    // Check for failed uploads first
    if (currentFailedAttachments.length > 0) {
      console.log('Found failed attachments:', currentFailedAttachments.map(att => att.id));
      toast({
        variant: "destructive",
        title: "Upload Errors",
        description: `${currentFailedAttachments.length} file(s) failed to upload. Please remove them or retry before sending.`,
      });
      return;
    }

    // If there are processing attachments, wait with proper state monitoring
    if (currentProcessingAttachments.length > 0) {
      console.log('Found processing attachments, waiting for completion...');
      
      const startTime = Date.now();
      let timeoutReached = false;
      
      const waitForProcessingComplete = () => {
        return new Promise<boolean>((resolve) => {
          const checkInterval = setInterval(() => {
            const currentTime = Date.now();
            if (currentTime - startTime > MESSAGE_SEND_TIMEOUT) {
              clearInterval(checkInterval);
              timeoutReached = true;
              console.log('Processing timeout reached');
              resolve(false);
              return;
            }
            
            // Get fresh attachment state by checking the current DOM/state
            setAttachments(currentAttachments => {
              const stillProcessing = currentAttachments.filter(att => 
                att.status === 'uploading' || att.status === 'processing'
              );
              
              const newFailures = currentAttachments.filter(att => att.status === 'error');
              
              console.log(`Processing check: ${stillProcessing.length} still processing, ${newFailures.length} failed`);
              
              if (newFailures.length > 0) {
                clearInterval(checkInterval);
                console.log('New failures detected during wait');
                resolve(false);
                return currentAttachments;
              }
              
              if (stillProcessing.length === 0) {
                clearInterval(checkInterval);
                console.log('All processing completed successfully');
                resolve(true);
                return currentAttachments;
              }
              
              return currentAttachments;
            });
          }, 500);
        });
      };
      
      const processingComplete = await waitForProcessingComplete();
      
      if (!processingComplete || timeoutReached) {
        console.log('Processing timeout or failed');
        toast({
          variant: "destructive",
          title: timeoutReached ? "Upload Timeout" : "Upload Failed",
          description: timeoutReached 
            ? "Some files are taking too long to process. Please remove failed uploads and try again."
            : "Some files failed to upload. Please remove failed uploads and try again.",
        });
        return;
      }
    }

    // Final validation before sending - get fresh state
    let finalAttachments: ChatAttachment[] = [];
    setAttachments(current => {
      finalAttachments = current;
      return current;
    });

    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 100));

    const finalFailedAttachments = finalAttachments.filter(att => att.status === 'error');
    const finalProcessingAttachments = finalAttachments.filter(att => 
      att.status === 'uploading' || att.status === 'processing'
    );

    if (finalFailedAttachments.length > 0 || finalProcessingAttachments.length > 0) {
      console.log('Final validation failed - still have failed or processing attachments');
      toast({
        variant: "destructive",
        title: "Upload Issues",
        description: "Please ensure all files are successfully uploaded before sending.",
      });
      return;
    }

    // Ensure all attachments are properly uploaded
    const uploadedAttachments = finalAttachments.filter(att => att.status === 'uploaded');
    if (finalAttachments.length > 0 && uploadedAttachments.length !== finalAttachments.length) {
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

  const validateAttachmentsStatus = (attachments: ChatAttachment[]) => {
    const processing = attachments.filter(att => 
      att.status === 'uploading' || att.status === 'processing'
    );
    const failed = attachments.filter(att => att.status === 'error');
    const uploaded = attachments.filter(att => att.status === 'uploaded');
    
    return {
      hasProcessing: processing.length > 0,
      hasFailed: failed.length > 0,
      allUploaded: attachments.length > 0 && uploaded.length === attachments.length,
      processing,
      failed,
      uploaded
    };
  };

  return {
    handleSendMessage,
    analyzeWithChat,
    validateAttachmentsStatus
  };
};
