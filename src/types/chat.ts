
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
  status: 'uploading' | 'processing' | 'uploaded' | 'error';
  file_size?: number; // FIX: Add file_size property for compatibility
  size?: number; // Also keep size for backward compatibility
  metadata?: {
    screenshots?: {
      desktop: { success: boolean; url: string; error?: string };
      mobile: { success: boolean; url: string; error?: string };
    };
  };
}
