
import React from 'react';
import { DesignChatContainer } from './chat/DesignChatContainer';

export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  uploadPath?: string;
  status?: 'pending' | 'uploading' | 'uploaded' | 'error' | 'processing';
  errorMessage?: string;
  processingInfo?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
  uploadIds?: string[];
  batchId?: string;
}

export const DesignChatInterface = () => {
  return <DesignChatContainer />;
};
