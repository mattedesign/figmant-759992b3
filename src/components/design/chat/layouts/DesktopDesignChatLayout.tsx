
import React from 'react';
import { ChatContainer } from '../ChatContainer';
import { ChatSidebar } from '../ChatSidebar';
import { ImprovedRoleAwareStorageManager } from '../ImprovedRoleAwareStorageManager';
import { useDesignChatLogic } from '../hooks/useDesignChatLogic';

export const DesktopDesignChatLayout = () => {
  const chatLogic = useDesignChatLogic();

  return (
    <>
      <ImprovedRoleAwareStorageManager
        setStorageStatus={chatLogic.setStorageStatus}
        setStorageErrorDetails={chatLogic.setStorageErrorDetails}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
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

        <ChatSidebar
          messages={chatLogic.messages}
          onSelectPrompt={chatLogic.handleSuggestedPrompt}
          extractedSuggestions={chatLogic.extractedSuggestions}
        />
      </div>
    </>
  );
};
