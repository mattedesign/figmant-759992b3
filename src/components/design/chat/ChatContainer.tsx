
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChatHeader } from './ChatHeader';
import { ChatContent } from './ChatContent';
import { ChatFooter } from './ChatFooter';
import { DebugPanel } from './DebugPanel';
import { ProcessingMonitor } from './ProcessingMonitor';
import { LoadingOverlay } from './LoadingOverlay';
import type { ChatMessage as ChatMessageType, ChatAttachment } from '../DesignChatInterface';
import type { ProcessingJob, SystemHealth } from '@/hooks/useImageProcessingMonitor';

interface ChatContainerProps {
  messages: ChatMessageType[];
  attachments: ChatAttachment[];
  message: string;
  urlInput: string;
  showUrlInput: boolean;
  storageStatus: 'checking' | 'ready' | 'error';
  storageErrorDetails?: any;
  showDebugPanel: boolean;
  showProcessingMonitor: boolean;
  lastAnalysisResult?: any;
  pendingImageProcessing: Set<string>;
  jobs: ProcessingJob[];
  systemHealth: SystemHealth;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  onUrlInputChange: (url: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
  onRemoveAttachment: (id: string) => void;
  onRetryAttachment: (id: string) => void;
  onClearAllAttachments: () => void;
  onImageProcessed: (attachmentId: string, processedFile: File, processingInfo: any) => void;
  onImageProcessingError: (attachmentId: string, error: string) => void;
  onToggleDebugPanel: () => void;
  onToggleProcessingMonitor: () => void;
  onStorageStatusChange: (status: 'checking' | 'ready' | 'error') => void;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  isLoading: boolean;
  canSendMessage: boolean;
  pauseJob: (id: string) => void;
  resumeJob: (id: string) => void;
  cancelJob: (id: string) => void;
  loadingState: any;
  getStageMessage: (stage: string) => string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  attachments,
  message,
  urlInput,
  showUrlInput,
  storageStatus,
  storageErrorDetails,
  showDebugPanel,
  showProcessingMonitor,
  lastAnalysisResult,
  pendingImageProcessing,
  jobs,
  systemHealth,
  onMessageChange,
  onSendMessage,
  onToggleUrlInput,
  onUrlInputChange,
  onAddUrl,
  onCancelUrl,
  onRemoveAttachment,
  onRetryAttachment,
  onClearAllAttachments,
  onImageProcessed,
  onImageProcessingError,
  onToggleDebugPanel,
  onToggleProcessingMonitor,
  onStorageStatusChange,
  getRootProps,
  getInputProps,
  isDragActive,
  isLoading,
  canSendMessage,
  pauseJob,
  resumeJob,
  cancelJob,
  loadingState,
  getStageMessage
}) => {
  // Calculate if we have content for MessageInput
  const hasContent = message.trim().length > 0 || attachments.length > 0;

  return (
    <div className="lg:col-span-2 space-y-4">
      <Card className="h-full flex flex-col">
        <ChatHeader
          onToggleProcessingMonitor={onToggleProcessingMonitor}
          onToggleDebugPanel={onToggleDebugPanel}
        />

        <CardContent className="flex-1 flex flex-col min-h-0">
          <ChatContent
            messages={messages}
            attachments={attachments}
            storageStatus={storageStatus}
            storageErrorDetails={storageErrorDetails}
            onStorageStatusChange={onStorageStatusChange}
            onRemoveAttachment={onRemoveAttachment}
            onRetryAttachment={onRetryAttachment}
            onClearAllAttachments={onClearAllAttachments}
          />

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
        </CardContent>
      </Card>

      {/* Debug Panel */}
      {showDebugPanel && (
        <DebugPanel
          attachments={attachments}
          lastAnalysisResult={lastAnalysisResult}
          isVisible={showDebugPanel}
        />
      )}

      {/* Processing Monitor */}
      {showProcessingMonitor && (
        <ProcessingMonitor
          jobs={jobs}
          systemHealth={systemHealth}
          onPauseJob={pauseJob}
          onResumeJob={resumeJob}
          onCancelJob={cancelJob}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <LoadingOverlay 
          isVisible={isLoading}
          stage={loadingState.stage}
        />
      )}
    </div>
  );
};
