
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { ChatContainer } from './ChatContainer';
import { ChatSidebar } from './ChatSidebar';
import { RoleAwareStorageManager } from './RoleAwareStorageManager';
import { useChatInterfaceState } from './hooks/useChatInterfaceState';
import { useAttachmentHandlers } from './hooks/useAttachmentHandlers';
import { useChatMessageHandlers } from './hooks/useChatMessageHandlers';
import { useFileHandlers } from './handlers/useFileHandlers';
import { useImageProcessingMonitor } from '@/hooks/useImageProcessingMonitor';

export const DesignChatContainer = () => {
  const {
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    urlInput,
    setUrlInput,
    showUrlInput,
    setShowUrlInput,
    storageStatus,
    setStorageStatus,
    storageErrorDetails,
    setStorageErrorDetails,
    lastAnalysisResult,
    setLastAnalysisResult,
    showDebugPanel,
    setShowDebugPanel,
    showProcessingMonitor,
    setShowProcessingMonitor
  } = useChatInterfaceState();

  const { 
    jobs, 
    systemHealth, 
    pauseJob, 
    resumeJob, 
    cancelJob 
  } = useImageProcessingMonitor();

  const {
    pendingImageProcessing,
    handleImageProcessed,
    handleImageProcessingError,
    handleFileDrop,
    handleRetryAttachment,
    handleClearAllAttachments
  } = useFileHandlers(storageStatus);

  const { addUrlAttachment, removeAttachment } = useAttachmentHandlers(
    attachments,
    setAttachments,
    setUrlInput,
    setShowUrlInput
  );

  const { 
    onSendMessage, 
    analyzeWithChat, 
    canSendMessage, 
    loadingState, 
    getStageMessage 
  } = useChatMessageHandlers(
    setMessages,
    setMessage,
    setAttachments,
    setLastAnalysisResult
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => handleFileDrop(acceptedFiles, attachments, setAttachments),
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: storageStatus !== 'ready' || loadingState.isLoading
  });

  const handleSuggestedPrompt = (prompt: string) => {
    if (!loadingState.isLoading) {
      setMessage(prompt);
    }
  };

  const retryAttachment = (id: string) => {
    if (!loadingState.isLoading) {
      handleRetryAttachment(attachments, setAttachments, id);
    }
  };

  const clearAllAttachments = () => {
    if (!loadingState.isLoading) {
      handleClearAllAttachments(setAttachments);
    }
  };

  const handleSendMessageWrapper = () => {
    onSendMessage(message, attachments);
  };

  const handleAddUrl = () => {
    if (!loadingState.isLoading) {
      addUrlAttachment(urlInput);
    }
  };

  const onImageProcessed = (attachmentId: string, processedFile: File, processingInfo: any) => {
    handleImageProcessed(attachments, setAttachments, attachmentId, processedFile, processingInfo);
  };

  const onImageProcessingError = (attachmentId: string, error: string) => {
    handleImageProcessingError(attachments, setAttachments, attachmentId, error);
  };

  return (
    <>
      <RoleAwareStorageManager
        setStorageStatus={setStorageStatus}
        setStorageErrorDetails={setStorageErrorDetails}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <ChatContainer
          messages={messages}
          attachments={attachments}
          message={message}
          urlInput={urlInput}
          showUrlInput={showUrlInput}
          storageStatus={storageStatus}
          storageErrorDetails={storageErrorDetails}
          showDebugPanel={showDebugPanel}
          showProcessingMonitor={showProcessingMonitor}
          lastAnalysisResult={lastAnalysisResult}
          pendingImageProcessing={pendingImageProcessing}
          jobs={jobs}
          systemHealth={systemHealth}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessageWrapper}
          onToggleUrlInput={() => !loadingState.isLoading && setShowUrlInput(!showUrlInput)}
          onUrlInputChange={setUrlInput}
          onAddUrl={handleAddUrl}
          onCancelUrl={() => setShowUrlInput(false)}
          onRemoveAttachment={removeAttachment}
          onRetryAttachment={retryAttachment}
          onClearAllAttachments={clearAllAttachments}
          onImageProcessed={onImageProcessed}
          onImageProcessingError={onImageProcessingError}
          onToggleDebugPanel={() => setShowDebugPanel(!showDebugPanel)}
          onToggleProcessingMonitor={() => setShowProcessingMonitor(!showProcessingMonitor)}
          onStorageStatusChange={setStorageStatus}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          isLoading={analyzeWithChat.isPending}
          canSendMessage={canSendMessage(message, attachments)}
          pauseJob={pauseJob}
          resumeJob={resumeJob}
          cancelJob={cancelJob}
          loadingState={loadingState}
          getStageMessage={getStageMessage}
        />

        <ChatSidebar
          messages={messages}
          onSelectPrompt={handleSuggestedPrompt}
        />
      </div>
    </>
  );
};
