
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useMessageHandlers } from '../MessageHandlers';

export const useChatMessageHandlers = (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
  setLastAnalysisResult: React.Dispatch<React.SetStateAction<any>>
) => {
  const { handleSendMessage, analyzeWithChat, validateAttachmentsStatus } = useMessageHandlers();

  const onSendMessage = (message: string, attachments: ChatAttachment[]) => {
    handleSendMessage(
      message,
      attachments,
      setMessages,
      setMessage,
      setAttachments,
      setLastAnalysisResult
    );
  };

  const canSendMessage = (message: string, attachments: ChatAttachment[]) => {
    const hasContent = message.trim().length > 0 || attachments.length > 0;
    if (!hasContent) return false;
    
    const status = validateAttachmentsStatus(attachments);
    return !status.hasProcessing && !status.hasFailed;
  };

  return {
    onSendMessage,
    analyzeWithChat,
    validateAttachmentsStatus,
    canSendMessage
  };
};
