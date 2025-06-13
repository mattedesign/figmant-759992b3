
import React from 'react';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { ChatAttachments } from './ChatAttachments';
import { StorageStatus } from './StorageStatus';
import { DebugPanel } from './DebugPanel';
import { ProcessingMonitor } from './ProcessingMonitor';
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
  onImageProcessed: (attachmentId: string, processedFile: File, processingInfo: any) => void;
  onImageProcessingError: (attachmentId: string, error: string) => void;
  onToggleDebugPanel: () => void;
  onToggleProcessingMonitor: () => void;
  onStorageStatusChange?: (status: 'checking' | 'ready' | 'error') => void;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  isLoading: boolean;
  pauseJob: (jobId: string) => void;
  resumeJob: (jobId: string) => void;
  cancelJob: (jobId: string) => void;
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
  onImageProcessed,
  onImageProcessingError,
  onToggleDebugPanel,
  onToggleProcessingMonitor,
  onStorageStatusChange,
  getRootProps,
  getInputProps,
  isDragActive,
  isLoading,
  pauseJob,
  resumeJob,
  cancelJob
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
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                Start a conversation by uploading a design or asking a question
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessageComponent key={msg.id} message={msg} />
            ))
          )}
        </div>

        <div className="border-t p-4">
          <ChatAttachments
            attachments={attachments}
            onRemove={onRemoveAttachment}
            onImageProcessed={onImageProcessed}
            onImageProcessingError={onImageProcessingError}
            pendingImageProcessing={pendingImageProcessing}
          />
          
          <MessageInput
            message={message}
            urlInput={urlInput}
            showUrlInput={showUrlInput}
            storageStatus={storageStatus}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
            onToggleUrlInput={onToggleUrlInput}
            onUrlInputChange={onUrlInputChange}
            onAddUrl={onAddUrl}
            onCancelUrl={onCancelUrl}
            onToggleDebugPanel={onToggleDebugPanel}
            onToggleProcessingMonitor={onToggleProcessingMonitor}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            isLoading={isLoading}
          />
        </div>
      </div>

      {showDebugPanel && (
        <DebugPanel
          lastAnalysisResult={lastAnalysisResult}
          attachments={attachments}
          storageStatus={storageStatus}
          storageErrorDetails={storageErrorDetails}
          onClose={onToggleDebugPanel}
        />
      )}

      {showProcessingMonitor && (
        <ProcessingMonitor
          jobs={jobs}
          systemHealth={systemHealth}
          pauseJob={pauseJob}
          resumeJob={resumeJob}
          cancelJob={cancelJob}
          onClose={onToggleProcessingMonitor}
        />
      )}
    </div>
  );
};
