
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useMessageHandlers } from '../MessageHandlers';

export const useChatMessageHandlers = (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
  setLastAnalysisResult: React.Dispatch<React.SetStateAction<any>>
) => {
  const { handleSendMessage, analyzeWithChat } = useMessageHandlers();

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

  return {
    onSendMessage,
    analyzeWithChat
  };
};
