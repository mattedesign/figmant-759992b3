
import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { MobileChatMessage } from './MobileChatMessage';
import { ChatAttachments } from './ChatAttachments';
import { ClaudeAISetupPrompt } from '../ClaudeAISetupPrompt';
import { RoleAwareStorageStatus } from './RoleAwareStorageStatus';
import { FileUploadDropzone } from './FileUploadDropzone';
import { MobileFileUploadDropzone } from './MobileFileUploadDropzone';
import { useIsMobile } from '@/hooks/use-mobile';
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
  isLoading?: boolean;
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
  onClearAllAttachments,
  isLoading = false
}) => {
  const isMobile = useIsMobile();
  
  // Determine if we should show storage-related Claude alert
  // Only show it if storage is in error state and there are failed attachments
  const hasFailedAttachments = attachments.some(att => att.status === 'error');
  const showStorageRelatedAlert = storageStatus === 'error' && hasFailedAttachments;

  // Choose the appropriate components based on mobile state
  const MessageComponent = isMobile ? MobileChatMessage : ChatMessage;
  const DropzoneComponent = isMobile ? MobileFileUploadDropzone : FileUploadDropzone;

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

      {/* File Upload Dropzone - Always show but handle disabled state */}
      {getRootProps && getInputProps && (
        <DropzoneComponent
          storageStatus={storageStatus}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          isLoading={isLoading}
        />
      )}

      {/* Chat Messages */}
      <div className={`flex-1 overflow-y-auto space-y-4 mb-4 min-h-0 ${isMobile ? 'pb-4' : ''}`}>
        {messages.length === 0 && (
          <div className={`text-center text-muted-foreground ${isMobile ? 'py-12 px-4' : 'py-8'}`}>
            <MessageSquarePlus className={`${isMobile ? 'h-16 w-16' : 'h-12 w-12'} mx-auto mb-4 opacity-50`} />
            <p className={isMobile ? 'text-lg font-medium' : ''}>Start a conversation about your design</p>
            <p className={`text-sm ${isMobile ? 'mt-2' : ''}`}>Upload images or ask questions to begin</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <MessageComponent 
            key={index} 
            message={msg}
          />
        ))}
      </div>

      {/* File Attachments */}
      {attachments.length > 0 && (
        <div className={isMobile ? 'px-4' : ''}>
          <ChatAttachments
            attachments={attachments}
            onRemove={onRemoveAttachment}
            onRetry={onRetryAttachment}
            onClearAll={onClearAllAttachments}
          />
        </div>
      )}
    </>
  );
};
