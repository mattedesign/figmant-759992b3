
import React from 'react';
import { ChatContainer } from './chat/ChatContainer';
import { useDesignChatLogic } from './chat/hooks/useDesignChatLogic';
import { ProcessedImage } from '@/utils/imageProcessing';

// Type definitions
export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  status: 'uploading' | 'processing' | 'uploaded' | 'error' | 'pending';
  uploadPath?: string;
  error?: string;
  errorMessage?: string;
  processingInfo?: ProcessedImage;
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
  const chatLogic = useDesignChatLogic();

  return (
    <div className="h-full">
      <ChatContainer
        messages={chatLogic.messages}
        attachments={chatLogic.attachments}
        message={chatLogic.message}
        urlInput={chatLogic.urlInput}
        showUrlInput={chatLogic.showUrlInput}
        storageStatus={chatLogic.storageStatus}
        storageErrorDetails={chatLogic.storageErrorDetails}
        showDebugPanel={chatLogic.showDebugPanel}
        showProcessingMonitor={chatLogic.showProcessingMonitor}
        lastAnalysisResult={chatLogic.lastAnalysisResult}
        pendingImageProcessing={chatLogic.pendingImageProcessing}
        jobs={chatLogic.jobs}
        systemHealth={chatLogic.systemHealth}
        onMessageChange={chatLogic.setMessage}
        onSendMessage={chatLogic.handleSendMessageWrapper}
        onToggleUrlInput={chatLogic.onToggleUrlInput}
        onUrlInputChange={chatLogic.onUrlInputChange}
        onAddUrl={chatLogic.handleAddUrl}
        onCancelUrl={chatLogic.onCancelUrl}
        onRemoveAttachment={chatLogic.removeAttachment}
        onRetryAttachment={chatLogic.retryAttachment}
        onClearAllAttachments={chatLogic.clearAllAttachments}
        onImageProcessed={chatLogic.onImageProcessed}
        onImageProcessingError={chatLogic.onImageProcessingError}
        onToggleDebugPanel={() => chatLogic.setShowDebugPanel(!chatLogic.showDebugPanel)}
        onToggleProcessingMonitor={() => chatLogic.setShowProcessingMonitor(!chatLogic.showProcessingMonitor)}
        onStorageStatusChange={chatLogic.setStorageStatus}
        getRootProps={chatLogic.getRootProps}
        getInputProps={chatLogic.getInputProps}
        isDragActive={chatLogic.isDragActive}
        isLoading={chatLogic.isLoading}
        canSendMessage={chatLogic.canSendMessage}
        pauseJob={chatLogic.pauseJob}
        resumeJob={chatLogic.resumeJob}
        cancelJob={chatLogic.cancelJob}
        loadingState={chatLogic.loadingState}
        getStageMessage={chatLogic.getStageMessage}
      />
    </div>
  );
};
