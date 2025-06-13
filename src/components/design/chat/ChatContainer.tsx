
import React from 'react';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { ChatAttachments } from './ChatAttachments';
import { StorageStatus } from './StorageStatus';
import { DebugPanel } from './DebugPanel';
import { ProcessingMonitor } from './ProcessingMonitor';
import { FileUploadDropzone } from './FileUploadDropzone';
import { URLInput } from './URLInput';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessageSkeleton } from './ChatMessageSkeleton';
import { ChatMessage, ChatAttachment } from '../DesignChatInterface';

interface ChatContainerProps {
  messages: ChatMessage[];
  attachments: ChatAttachment[];
  message: string;
  urlInput: string;
  showUrlInput: boolean;
  storageStatus: 'checking' | 'ready' | 'error';
  storageErrorDetails?: any;
  showDebugPanel: boolean;
  showProcessingMonitor: boolean;
  lastAnalysisResult: any;
  pendingImageProcessing: Set<string>;
  jobs: any[];
  systemHealth: any;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  onUrlInputChange: (url: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
  onRemoveAttachment: (id: string) => void;
  onRetryAttachment?: (id: string) => void;
  onClearAllAttachments?: () => void;
  onImageProcessed: (attachmentId: string, processedFile: File, processingInfo: any) => void;
  onImageProcessingError: (attachmentId: string, error: string) => void;
  onToggleDebugPanel: () => void;
  onToggleProcessingMonitor: () => void;
  onStorageStatusChange?: (status: 'checking' | 'ready' | 'error') => void;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  isLoading: boolean;
  canSendMessage: boolean;
  pauseJob: (jobId: string) => void;
  resumeJob: (jobId: string) => void;
  cancelJob: (jobId: string) => void;
  // New props for enhanced loading states
  loadingState?: {
    isLoading: boolean;
    stage: string | null;
    progress: number;
    estimatedTimeRemaining: number | null;
  };
  getStageMessage?: () => string;
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
  return (
    <div className="lg:col-span-2 flex flex-col h-full">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-2">AI Design Analysis Chat</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload images, PDFs, or share URLs for comprehensive UX analysis and insights.
          </p>
          
          <StorageStatus 
            status={storageStatus} 
            onStatusChange={onStorageStatusChange}
            errorDetails={storageErrorDetails}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !loadingState?.isLoading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                Start a conversation by uploading a design or asking a question
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessageComponent key={msg.id} message={msg} />
              ))}
              
              {/* Show typing indicator when AI is processing */}
              {loadingState?.isLoading && loadingState.stage && (
                <TypingIndicator
                  stage={loadingState.stage}
                  progress={loadingState.progress}
                  estimatedTimeRemaining={loadingState.estimatedTimeRemaining}
                  stageMessage={getStageMessage?.() || 'Processing...'}
                />
              )}
            </>
          )}
        </div>

        <div className="border-t p-4 space-y-4">
          <FileUploadDropzone
            storageStatus={storageStatus}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
          />
          
          <URLInput
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            onUrlInputChange={onUrlInputChange}
            onAddUrl={onAddUrl}
            onCancel={onCancelUrl}
          />
          
          <ChatAttachments
            attachments={attachments}
            onRemove={onRemoveAttachment}
            onRetry={onRetryAttachment}
            onClearAll={onClearAllAttachments}
          />
          
          <MessageInput
            message={message}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
            onToggleUrlInput={onToggleUrlInput}
            isLoading={loadingState?.isLoading || isLoading}
            hasContent={message.trim().length > 0 || attachments.length > 0}
            canSend={canSendMessage}
            loadingStage={getStageMessage?.()}
          />
        </div>
      </div>

      {showDebugPanel && (
        <DebugPanel
          attachments={attachments}
          lastAnalysisResult={lastAnalysisResult}
          isVisible={showDebugPanel}
        />
      )}

      {showProcessingMonitor && (
        <ProcessingMonitor
          jobs={jobs}
          systemHealth={systemHealth}
          onPauseJob={pauseJob}
          onResumeJob={resumeJob}
          onCancelJob={cancelJob}
        />
      )}
    </div>
  );
};
