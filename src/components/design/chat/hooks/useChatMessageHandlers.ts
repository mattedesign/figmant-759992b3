
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useMessageHandlers } from '../MessageHandlers';
import { useAIAnalysisLoading } from './useAIAnalysisLoading';

export const useChatMessageHandlers = (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
  setLastAnalysisResult: React.Dispatch<React.SetStateAction<any>>
) => {
  const { handleSendMessage, analyzeWithChat, validateAttachmentsStatus } = useMessageHandlers();
  const { loadingState, startAnalysis, completeAnalysis, resetAnalysis, getStageMessage } = useAIAnalysisLoading();

  const onSendMessage = async (message: string, attachments: ChatAttachment[]) => {
    // Start the AI analysis loading state
    startAnalysis();
    
    try {
      await handleSendMessage(
        message,
        attachments,
        setMessages,
        setMessage,
        setAttachments,
        setLastAnalysisResult
      );
      
      // Complete the analysis successfully
      completeAnalysis();
    } catch (error) {
      // Reset on error
      resetAnalysis();
      throw error;
    }
  };

  const canSendMessage = (message: string, attachments: ChatAttachment[]) => {
    const hasContent = message.trim().length > 0 || attachments.length > 0;
    if (!hasContent) return false;
    
    const status = validateAttachmentsStatus(attachments);
    return !status.hasProcessing && !status.hasFailed && !loadingState.isLoading;
  };

  return {
    onSendMessage,
    analyzeWithChat,
    validateAttachmentsStatus,
    canSendMessage,
    loadingState,
    getStageMessage,
    resetAnalysis
  };
};
