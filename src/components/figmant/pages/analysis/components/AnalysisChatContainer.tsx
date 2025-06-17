
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { ChatMessages } from '../ChatMessages';
import { AnalysisChatPlaceholder } from '../AnalysisChatPlaceholder';
import { AnalysisChatInput } from '../AnalysisChatInput';
import { URLInputSection } from '../URLInputSection';

interface AnalysisChatContainerProps {
  messages: ChatMessage[];
  isAnalyzing: boolean;
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  getCurrentTemplate: () => any;
  canSend: boolean;
  onFileUpload: (files: FileList) => void;
  onToggleUrlInput: () => void;
  showUrlInput: boolean;
  urlInput: string;
  setUrlInput: (url: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
  onTemplateSelect: (templateId: string) => void;
  availableTemplates: any[];
  onViewTemplate: (template: any) => void;
  attachments?: ChatAttachment[];
  onRemoveAttachment?: (attachmentId: string) => void;
}

export const AnalysisChatContainer: React.FC<AnalysisChatContainerProps> = ({
  messages,
  isAnalyzing,
  message,
  setMessage,
  onSendMessage,
  onKeyPress,
  getCurrentTemplate,
  canSend,
  onFileUpload,
  onToggleUrlInput,
  showUrlInput,
  urlInput,
  setUrlInput,
  onAddUrl,
  onCancelUrl,
  onTemplateSelect,
  availableTemplates,
  onViewTemplate,
  attachments = [],
  onRemoveAttachment
}) => {
  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Messages Area or Placeholder */}
      <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
        {hasMessages ? (
          <div className="p-6">
            <ChatMessages messages={messages} isAnalyzing={isAnalyzing} />
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <AnalysisChatPlaceholder />
          </div>
        )}
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <URLInputSection 
          urlInput={urlInput} 
          setUrlInput={setUrlInput} 
          onAddUrl={onAddUrl} 
          onCancel={onCancelUrl} 
        />
      )}

      {/* Chat Input */}
      <AnalysisChatInput 
        message={message} 
        setMessage={setMessage} 
        onSendMessage={onSendMessage} 
        onKeyPress={onKeyPress} 
        selectedPromptTemplate={getCurrentTemplate()} 
        canSend={canSend} 
        isAnalyzing={isAnalyzing} 
        onFileUpload={onFileUpload} 
        onToggleUrlInput={onToggleUrlInput}
        onTemplateSelect={onTemplateSelect}
        availableTemplates={availableTemplates}
        onViewTemplate={onViewTemplate}
        attachments={attachments}
        onRemoveAttachment={onRemoveAttachment}
      />
    </>
  );
};
