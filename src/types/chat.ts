
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  uploadPath?: string;
  status: 'uploading' | 'processing' | 'uploaded' | 'error' | 'pending';
  file_size?: number;
  size?: number;
  metadata?: {
    screenshots?: {
      desktop: { success: boolean; url: string; error?: string };
      mobile: { success: boolean; url: string; error?: string };
    };
  };
}

export interface SavedChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  attachments?: Array<{
    id?: string;
    type: 'file' | 'url';
    name?: string;
    url?: string;
    path?: string;
  }>;
}

export interface MessageHistoryState {
  isLoading: boolean;
  messages: ChatMessage[];
  hasMore: boolean;
  error?: string;
}
