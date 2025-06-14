
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Settings, Activity } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { ChatAttachments } from './ChatAttachments';
import { RoleAwareStorageStatus } from './RoleAwareStorageStatus';
import { URLInput } from './URLInput';
import { DebugPanel } from './DebugPanel';
import { ProcessingMonitor } from './ProcessingMonitor';
import { LoadingOverlay } from './LoadingOverlay';
import { ClaudeAISetupPrompt } from '../ClaudeAISetupPrompt';
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
  return (
    <div className="lg:col-span-2 space-y-4">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5" />
              Design Analysis Chat
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleProcessingMonitor}
                className="flex items-center gap-1"
              >
                <Activity className="h-3 w-3" />
                Monitor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleDebugPanel}
                className="flex items-center gap-1"
              >
                <Settings className="h-3 w-3" />
                Debug
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0">
          <ClaudeAISetupPrompt />
          
          <RoleAwareStorageStatus 
            status={storageStatus}
            onStatusChange={onStorageStatusChange}
            errorDetails={storageErrorDetails}
          />

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

          {/* URL Input */}
          {showUrlInput && (
            <URLInput
              urlInput={urlInput}
              onChange={onUrlInputChange}
              onAdd={onAddUrl}
              onCancel={onCancelUrl}
              disabled={isLoading}
            />
          )}

          {/* Message Input */}
          <div className="flex-shrink-0">
            <MessageInput
              message={message}
              onMessageChange={onMessageChange}
              onSendMessage={onSendMessage}
              onToggleUrlInput={onToggleUrlInput}
              isLoading={isLoading}
              storageStatus={storageStatus}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />
          </div>
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
          stage={loadingState.stage}
        />
      )}
    </div>
  );
};
