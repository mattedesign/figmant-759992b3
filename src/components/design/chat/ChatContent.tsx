
import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatAttachments } from './ChatAttachments';
import { ClaudeAISetupPrompt } from '../ClaudeAISetupPrompt';
import { RoleAwareStorageStatus } from './RoleAwareStorageStatus';
import { FileUploadDropzone } from './FileUploadDropzone';
import type { ChatMessage as ChatMessageType, ChatAttachment } from '../DesignChatInterface';

interface ChatContentProps {
  messages: ChatMessageType[];
  attachments: ChatAttachment[];
  storageStatus: 'checking' | 'ready' | 'error';
  storageErrorDetails?: any;
  getRootProps?: any;
  getInputProps?: any;
  isDragActive?: boolean;
  onStorageStatusChange: (status: 'checking' | 'ready' | 'error') => void;
  onRemoveAttachment: (id: string) => void;
  onRetryAttachment: (id: string) => void;
  onClearAllAttachments: () => void;
}

export const ChatContent: React.FC<ChatContentProps> = ({
  messages,
  attachments,
  storageStatus,
  storageErrorDetails,
  getRootProps,
  getInputProps,
  isDragActive = false,
  onStorageStatusChange,
  onRemoveAttachment,
  onRetryAttachment,
  onClearAllAttachments
}) => {
  // Determine if we should show storage-related Claude alert
  // Only show it if storage is in error state and there are failed attachments
  const hasFailedAttachments = attachments.some(att => att.status === 'error');
  const showStorageRelatedAlert = storageStatus === 'error' && hasFailedAttachments;

  return (
    <>
      <ClaudeAISetupPrompt 
        storageStatus={storageStatus}
        showStorageRelatedAlert={showStorageRelatedAlert}
      />
      
      <RoleAwareStorageStatus 
        status={storageStatus}
        onStatusChange={onStorageStatusChange}
        errorDetails={storageErrorDetails}
      />

      {/* File Upload Dropzone */}
      {getRootProps && getInputProps && (
        <FileUploadDropzone
          storageStatus={storageStatus}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <MessageSquarePlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start a conversation about your design</p>
            <p className="text-sm">Upload images or ask questions to begin</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <ChatMessage 
            key={index} 
            message={msg}
          />
        ))}
      </div>

      {/* File Attachments */}
      {attachments.length > 0 && (
        <ChatAttachments
          attachments={attachments}
          onRemove={onRemoveAttachment}
          onRetry={onRetryAttachment}
          onClearAll={onClearAllAttachments}
        />
      )}
    </>
  );
};
