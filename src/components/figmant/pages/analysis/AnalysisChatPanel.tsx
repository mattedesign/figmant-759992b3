
import React from 'react';
import { ChatMessages } from './ChatMessages';
import { MessageInputSection } from './MessageInputSection';
import { URLInputSection } from './URLInputSection';
import { AttachmentPreview } from './AttachmentPreview';
import { useMessageHandler } from './useMessageHandler';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AnalysisChatPanelProps {
  message: string;
  setMessage: (message: string) => void;
  messages: any[];
  setMessages: (messages: any[]) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[]) => void;
  urlInput: string;
  setUrlInput: (url: string) => void;
  showUrlInput: boolean;
  setShowUrlInput: (show: boolean) => void;
  selectedPromptTemplate?: any;
  selectedPromptCategory?: string;
  promptTemplates?: any[];
  onAnalysisComplete?: (result: any) => void;
}

export const AnalysisChatPanel: React.FC<AnalysisChatPanelProps> = ({
  message,
  setMessage,
  messages,
  setMessages,
  attachments,
  setAttachments,
  urlInput,
  setUrlInput,
  showUrlInput,
  setShowUrlInput,
  selectedPromptTemplate,
  selectedPromptCategory,
  promptTemplates,
  onAnalysisComplete
}) => {
  const {
    isAnalyzing,
    canSend,
    handleSendMessage,
    handleKeyPress
  } = useMessageHandler({
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    selectedPromptTemplate,
    selectedPromptCategory,
    promptTemplates,
    onAnalysisComplete
  });

  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    const newAttachments = fileArray.map(file => ({
      id: crypto.randomUUID(),
      type: 'file' as const,
      name: file.name,
      file,
      status: 'pending' as const
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      const newAttachment = {
        id: crypto.randomUUID(),
        type: 'url' as const,
        name: urlInput,
        url: urlInput,
        status: 'uploaded' as const
      };

      setAttachments([...attachments, newAttachment]);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <ChatMessages messages={messages} isAnalyzing={isAnalyzing} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-4">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <AttachmentPreview 
            attachments={attachments}
            onRemove={handleRemoveAttachment}
          />
        )}

        {/* URL Input */}
        {showUrlInput && (
          <URLInputSection
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            onUrlInputChange={setUrlInput}
            onAddUrl={handleAddUrl}
            onCancel={() => setShowUrlInput(false)}
          />
        )}

        {/* Message Input */}
        <MessageInputSection
          message={message}
          setMessage={setMessage}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          onFileUpload={handleFileUpload}
          onToggleUrlInput={() => setShowUrlInput(!showUrlInput)}
          canSend={canSend}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </div>
  );
};
