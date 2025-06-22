
import { ChatMessage as BaseChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';

export interface ExtendedChatMessage extends BaseChatMessage {
  metadata?: {
    confidence?: number;
    tokensUsed?: number;
    analysisType?: string;
    responseTime?: number;
    error?: boolean;
  };
}

export interface SingleAttachmentDisplayProps {
  attachment: ChatAttachment;
  size?: 'sm' | 'md' | 'lg';
  showRemove?: boolean;
  onRemove?: (id: string) => void;
}
