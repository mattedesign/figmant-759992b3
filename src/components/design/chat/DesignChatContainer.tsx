
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { ChatContainer } from './ChatContainer';
import { ChatSidebar } from './ChatSidebar';
import { ImprovedRoleAwareStorageManager } from './ImprovedRoleAwareStorageManager';
import { useChatInterfaceState } from './hooks/useChatInterfaceState';
import { useAttachmentHandlers } from './hooks/useAttachmentHandlers';
import { useChatMessageHandlers } from './hooks/useChatMessageHandlers';
import { useFileHandlers } from './handlers/useFileHandlers';
import { useImageProcessingMonitor } from '@/hooks/useImageProcessingMonitor';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const DesignChatContainer = () => {
  const isMobile = useIsMobile();
  
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

  console.log('=== DESIGN CHAT CONTAINER DEBUG ===');
  console.log('Storage status:', storageStatus);
  console.log('Storage error details:', storageErrorDetails);
  console.log('Attachments count:', attachments.length);

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
    onDrop: (acceptedFiles) => {
      console.log('=== DROPZONE FILE DROP ===');
      console.log('Files dropped:', acceptedFiles.length);
      console.log('Current storage status:', storageStatus);
      
      if (storageStatus !== 'ready') {
        console.warn('Dropzone: Storage not ready, files will be queued');
      }
      
      handleFileDrop(acceptedFiles, attachments, setAttachments);
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: loadingState.isLoading
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
    console.log('=== SEND MESSAGE WRAPPER ===');
    console.log('Message length:', message.length);
    console.log('Attachments count:', attachments.length);
    console.log('Storage status:', storageStatus);
    
    onSendMessage(message, attachments);
  };

  const handleAddUrl = () => {
    if (!loadingState.isLoading) {
      addUrlAttachment(urlInput);
    }
  };

  const onImageProcessed = (attachmentId: string, processedFile: File, processingInfo: any) => {
    console.log('=== IMAGE PROCESSED CALLBACK ===');
    console.log('Attachment ID:', attachmentId);
    console.log('Processed file size:', processedFile.size);
    
    handleImageProcessed(attachments, setAttachments, attachmentId, processedFile, processingInfo);
  };

  const onImageProcessingError = (attachmentId: string, error: string) => {
    console.log('=== IMAGE PROCESSING ERROR CALLBACK ===');
    console.log('Attachment ID:', attachmentId);
    console.log('Error:', error);
    
    handleImageProcessingError(attachments, setAttachments, attachmentId, error);
  };

  if (isMobile) {
    return (
      <>
        <ImprovedRoleAwareStorageManager
          setStorageStatus={setStorageStatus}
          setStorageErrorDetails={setStorageErrorDetails}
        />
        
        <div className="h-[calc(100vh-120px)] flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
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
            </TabsContent>
            
            <TabsContent value="prompts" className="flex-1 mt-0 p-4">
              <ChatSidebar
                messages={messages}
                onSelectPrompt={handleSuggestedPrompt}
              />
            </TabsContent>
          </Tabs>
        </div>
      </>
    );
  }

  // Desktop layout
  return (
    <>
      <ImprovedRoleAwareStorageManager
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
