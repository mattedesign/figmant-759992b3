
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChatContainerContent } from './ChatContainerContent';
import { DebugPanel } from './DebugPanel';
import { ProcessingMonitor } from './ProcessingMonitor';
import { LoadingOverlay } from './LoadingOverlay';
import type { ChatMessage as ChatMessageType, ChatAttachment } from '../DesignChatInterface';
import type { ProcessingJob, SystemHealth } from '@/hooks/useImageProcessingMonitor';

interface MobileChatContainerProps {
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

export const MobileChatContainer: React.FC<MobileChatContainerProps> = ({
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
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ChatContainerContent
          messages={messages}
          attachments={attachments}
          message={message}
          urlInput={urlInput}
          showUrlInput={showUrlInput}
          storageStatus={storageStatus}
          storageErrorDetails={storageErrorDetails}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onToggleUrlInput={onToggleUrlInput}
          onUrlInputChange={onUrlInputChange}
          onAddUrl={onAddUrl}
          onCancelUrl={onCancelUrl}
          onRemoveAttachment={onRemoveAttachment}
          onRetryAttachment={onRetryAttachment}
          onClearAllAttachments={onClearAllAttachments}
          onToggleDebugPanel={onToggleDebugPanel}
          onToggleProcessingMonitor={onToggleProcessingMonitor}
          onStorageStatusChange={onStorageStatusChange}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          isLoading={isLoading}
          canSendMessage={canSendMessage}
          loadingState={loadingState}
          getStageMessage={getStageMessage}
        />
      </Card>

      {/* Debug Panel - Mobile Modal */}
      {showDebugPanel && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <DebugPanel
            attachments={attachments}
            lastAnalysisResult={lastAnalysisResult}
            isVisible={showDebugPanel}
          />
        </div>
      )}

      {/* Processing Monitor - Mobile Modal */}
      {showProcessingMonitor && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <ProcessingMonitor
            jobs={jobs}
            systemHealth={systemHealth}
            onPauseJob={pauseJob}
            onResumeJob={resumeJob}
            onCancelJob={cancelJob}
          />
        </div>
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
