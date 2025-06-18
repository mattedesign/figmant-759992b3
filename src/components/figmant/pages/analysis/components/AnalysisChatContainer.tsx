
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { ChatMessages } from '../ChatMessages';
import { AnalysisChatPlaceholder } from '../AnalysisChatPlaceholder';
import { AnalysisChatInput } from '../AnalysisChatInput';
import { URLInputSection } from '../URLInputSection';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="h-full flex flex-col">
      {/* Single scrollable content area */}
      <ScrollArea className="flex-1 w-full">
        <div className="min-h-full">
          {hasMessages ? (
            <div className="p-6 bg-[#F9FAFB]">
              <ChatMessages messages={messages} isAnalyzing={isAnalyzing} />
            </div>
          ) : (
            <div className="h-full bg-[#F9FAFB]">
              <AnalysisChatPlaceholder />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* URL Input - Fixed at bottom */}
      {showUrlInput && (
        <div className="flex-shrink-0">
          <URLInputSection 
            urlInput={urlInput} 
            setUrlInput={setUrlInput} 
            onAddUrl={onAddUrl} 
            onCancel={onCancelUrl} 
          />
        </div>
      )}

      {/* Chat Input - Fixed at bottom */}
      <div className="flex-shrink-0">
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
      </div>
    </div>
  );
};
