
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFigmantPromptTemplates, useBestFigmantPrompt } from '@/hooks/useFigmantChatAnalysis';
import { PromptTemplateSelector } from './PromptTemplateSelector';
import { ChatMessages } from './ChatMessages';
import { AttachmentPreview } from './AttachmentPreview';
import { URLInputSection } from './URLInputSection';
import { MessageInputSection } from './MessageInputSection';
import { useChatState } from './ChatStateManager';
import { useFileUploadHandler } from './useFileUploadHandler';
import { useMessageHandler } from './useMessageHandler';

interface AnalysisChatPanelProps {
  analysis: any;
  onAttachmentsChange?: (attachments: any[]) => void;
}

export const AnalysisChatPanel: React.FC<AnalysisChatPanelProps> = ({
  analysis,
  onAttachmentsChange
}) => {
  const {
    message,
    setMessage,
    messages,
    setMessages,
    attachments,
    setAttachments,
    selectedPromptCategory,
    setSelectedPromptCategory,
    selectedPromptTemplate,
    setSelectedPromptTemplate,
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput
  } = useChatState({ onAttachmentsChange });

  const { data: promptTemplates, isLoading: promptsLoading } = useFigmantPromptTemplates();
  const { data: bestPrompt } = useBestFigmantPrompt(selectedPromptCategory);

  // Initialize file upload handler
  const fileUploadHandler = useFileUploadHandler({ attachments, setAttachments });

  // Initialize message handler
  const messageHandler = useMessageHandler({
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    selectedPromptTemplate,
    selectedPromptCategory,
    promptTemplates
  });

  const handleAddUrl = () => {
    fileUploadHandler.handleAddUrl(urlInput, setUrlInput, setShowUrlInput);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-48 grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompts" className="mt-4">
            <PromptTemplateSelector
              promptTemplates={promptTemplates}
              promptsLoading={promptsLoading}
              selectedPromptCategory={selectedPromptCategory}
              selectedPromptTemplate={selectedPromptTemplate}
              onPromptCategoryChange={setSelectedPromptCategory}
              onPromptTemplateChange={setSelectedPromptTemplate}
              bestPrompt={bestPrompt}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages 
          messages={messages}
          isAnalyzing={messageHandler.isAnalyzing}
        />
      </div>

      {/* Attachments Preview */}
      <AttachmentPreview
        attachments={attachments}
        onRemove={fileUploadHandler.removeAttachment}
      />

      {/* URL Input */}
      <URLInputSection
        showUrlInput={showUrlInput}
        urlInput={urlInput}
        onUrlInputChange={setUrlInput}
        onAddUrl={handleAddUrl}
        onCancel={() => setShowUrlInput(false)}
      />

      {/* Message Input */}
      <MessageInputSection
        message={message}
        onMessageChange={setMessage}
        onSendMessage={messageHandler.handleSendMessage}
        onToggleUrlInput={() => setShowUrlInput(!showUrlInput)}
        onKeyPress={messageHandler.handleKeyPress}
        onFileUpload={fileUploadHandler.handleFileUpload}
        isAnalyzing={messageHandler.isAnalyzing}
        canSend={messageHandler.canSend}
      />
    </div>
  );
};
