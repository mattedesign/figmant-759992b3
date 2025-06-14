
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatContainer } from '../ChatContainer';
import { ChatSidebar } from '../ChatSidebar';
import { ImprovedRoleAwareStorageManager } from '../ImprovedRoleAwareStorageManager';
import { useDesignChatLogic } from '../hooks/useDesignChatLogic';

export const MobileDesignChatLayout = () => {
  const chatLogic = useDesignChatLogic();

  return (
    <>
      <ImprovedRoleAwareStorageManager
        setStorageStatus={chatLogic.setStorageStatus}
        setStorageErrorDetails={chatLogic.setStorageErrorDetails}
      />
      
      <div className="h-[calc(100vh-120px)] flex flex-col">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
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
          </TabsContent>
          
          <TabsContent value="prompts" className="flex-1 mt-0 p-4">
            <ChatSidebar
              messages={chatLogic.messages}
              onSelectPrompt={chatLogic.handleSuggestedPrompt}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
