
import { ChatAttachment } from '@/components/design/DesignChatInterface';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
  mode?: 'chat' | 'analyze';
}

export interface SavedChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  message_order: number;
  metadata: any;
  attachments: any[];
}

export interface MessageHistoryState {
  isLoading: boolean;
  messages: ChatMessage[];
  hasMore: boolean;
  error?: string;
}

export interface MessageContextData {
  sessionId: string;
  messageCount: number;
  recentMessages: ChatMessage[];
  conversationSummary?: string;
}
