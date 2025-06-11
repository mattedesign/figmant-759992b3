
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Bug } from 'lucide-react';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { ChatAttachments } from './ChatAttachments';
import { FileUploadDropzone } from './FileUploadDropzone';
import { URLInput } from './URLInput';
import { MessageInput } from './MessageInput';
import { DebugPanel } from './DebugPanel';
import { EnhancedImageUpload } from './EnhancedImageUpload';
import { ProcessingMonitor } from './ProcessingMonitor';
import { StorageStatus } from './StorageStatus';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';

interface ChatContainerProps {
  messages: ChatMessage[];
  attachments: ChatAttachment[];
  message: string;
  urlInput: string;
  showUrlInput: boolean;
  storageStatus: 'checking' | 'ready' | 'error';
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
  getRootProps: () => any;
  getInputProps: () => any;
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
  getRootProps,
  getInputProps,
  isDragActive,
  isLoading,
  pauseJob,
  resumeJob,
  cancelJob
}) => {
  return (
    <div className="lg:col-span-2 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Design Analysis Chat</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleProcessingMonitor}
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                {showProcessingMonitor ? 'Hide' : 'Show'} Monitor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleDebugPanel}
                className="flex items-center gap-2"
              >
                <Bug className="h-4 w-4" />
                {showDebugPanel ? 'Hide' : 'Show'} Debug
              </Button>
            </div>
          </div>
          <StorageStatus status={storageStatus} />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p className="mb-4">👋 Hi! I'm your UX analysis assistant.</p>
                <p className="mb-4">Upload designs or share website URLs and ask me anything about:</p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <Badge variant="outline">User Experience</Badge>
                  <Badge variant="outline">Conversion Optimization</Badge>
                  <Badge variant="outline">Visual Design</Badge>
                  <Badge variant="outline">Accessibility</Badge>
                  <Badge variant="outline">Performance</Badge>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessageComponent key={msg.id} message={msg} />
              ))
            )}
          </div>

          {/* File Upload Area */}
          <FileUploadDropzone 
            storageStatus={storageStatus}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
          />

          {/* Enhanced Image Processing Display */}
          {attachments.filter(att => att.status === 'processing').map(attachment => (
            <EnhancedImageUpload
              key={attachment.id}
              file={attachment.file!}
              onProcessed={(processedFile, processingInfo) => 
                onImageProcessed(attachment.id, processedFile, processingInfo)
              }
              onError={(error) => onImageProcessingError(attachment.id, error)}
            />
          ))}

          {/* Attachments */}
          {attachments.filter(att => att.status !== 'processing').length > 0 && (
            <ChatAttachments 
              attachments={attachments.filter(att => att.status !== 'processing')} 
              onRemove={onRemoveAttachment} 
            />
          )}

          {/* URL Input */}
          <URLInput 
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            onUrlInputChange={onUrlInputChange}
            onAddUrl={onAddUrl}
            onCancel={onCancelUrl}
          />

          {/* Message Input */}
          <MessageInput 
            message={message}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
            onToggleUrlInput={onToggleUrlInput}
            isLoading={isLoading}
            hasContent={message.trim().length > 0 || attachments.length > 0}
          />
        </CardContent>
      </Card>

      {/* Processing Monitor */}
      {showProcessingMonitor && (
        <ProcessingMonitor
          jobs={jobs}
          onPauseJob={pauseJob}
          onResumeJob={resumeJob}
          onCancelJob={cancelJob}
          systemHealth={systemHealth}
        />
      )}

      {/* Debug Panel */}
      <DebugPanel 
        attachments={attachments}
        lastAnalysisResult={lastAnalysisResult}
        isVisible={showDebugPanel}
      />
    </div>
  );
};
