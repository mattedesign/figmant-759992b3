
import React from 'react';

// Type definitions
export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  status: 'pending' | 'processing' | 'uploading' | 'uploaded' | 'error';
  errorMessage?: string;
  uploadPath?: string;
  processingInfo?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: ChatAttachment[];
  timestamp: Date;
  uploadIds?: string[];
  batchId?: string;
}

export const DesignChatInterface: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Design Chat Interface</h2>
        <p className="text-gray-600">Chat interface component will be implemented here</p>
      </div>
    </div>
  );
};
