
export interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{ type: 'text' | 'image'; text?: string; source?: any }>;
}

export interface AttachmentData {
  name: string;
  type: string; // This can be 'file', 'url', or image MIME types like 'image/png', 'image/jpeg', etc.
  path?: string;
  uploadPath?: string;
  url?: string;
  size?: number;
}
