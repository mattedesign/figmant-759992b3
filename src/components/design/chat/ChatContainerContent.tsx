
import React from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatContent } from './ChatContent';
import { ChatFooter } from './ChatFooter';
import type { ChatMessage as ChatMessageType, ChatAttachment } from '../DesignChatInterface';

interface ChatContainerContentProps {
  messages: ChatMessageType[];
  attachments: ChatAttachment[];
  message: string;
  urlInput: string;
  showUrlInput: boolean;
  storageStatus: 'checking' | 'ready' | 'error';
  storageErrorDetails?: any;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  onUrlInputChange: (url: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
  onRemoveAttachment: (id: string) => void;
  onRetryAttachment: (id: string) => void;
  onClearAllAttachments: () => void;
  onToggleDebugPanel: () => void;
  onToggleProcessingMonitor: () => void;
  onStorageStatusChange: (status: 'checking' | 'ready' | 'error') => void;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  isLoading: boolean;
  canSendMessage: boolean;
  loadingState: any;
  getStageMessage: (stage: string) => string;
}

export const ChatContainerContent: React.FC<ChatContainerContentProps> = ({
  messages,
  attachments,
  message,
  urlInput,
  showUrlInput,
  storageStatus,
  storageErrorDetails,
  onMessageChange,
  onSendMessage,
  onToggleUrlInput,
  onUrlInputChange,
  onAddUrl,
  onCancelUrl,
  onRemoveAttachment,
  onRetryAttachment,
  onClearAllAttachments,
  onToggleDebugPanel,
  onToggleProcessingMonitor,
  onStorageStatusChange,
  getRootProps,
  getInputProps,
  isDragActive,
  isLoading,
  canSendMessage,
  loadingState,
  getStageMessage
}) => {
  // Calculate if we have content for MessageInput
  const hasContent = message.trim().length > 0 || attachments.length > 0;

  return (
    <>
      <ChatHeader
        onToggleProcessingMonitor={onToggleProcessingMonitor}
        onToggleDebugPanel={onToggleDebugPanel}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatContent
          messages={messages}
          attachments={attachments}
          storageStatus={storageStatus}
          storageErrorDetails={storageErrorDetails}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          onStorageStatusChange={onStorageStatusChange}
          onRemoveAttachment={onRemoveAttachment}
          onRetryAttachment={onRetryAttachment}
          onClearAllAttachments={onClearAllAttachments}
          isLoading={isLoading}
        />
      </div>

      <ChatFooter
        message={message}
        urlInput={urlInput}
        showUrlInput={showUrlInput}
        isLoading={isLoading}
        hasContent={hasContent}
        canSendMessage={canSendMessage}
        loadingState={loadingState}
        getStageMessage={getStageMessage}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onToggleUrlInput={onToggleUrlInput}
        onUrlInputChange={onUrlInputChange}
        onAddUrl={onAddUrl}
        onCancelUrl={onCancelUrl}
      />
    </>
  );
};
