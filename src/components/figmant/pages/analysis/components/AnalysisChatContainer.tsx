
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { ChatMessages } from '../ChatMessages';
import { MessageInputSection } from '../MessageInputSection';
import { SelectedTemplateCard } from '../SelectedTemplateCard';
import { AttachmentPreview } from '../AttachmentPreview';
import { CreditStatusChecker } from './CreditStatusChecker';

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
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
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
  attachments,
  onRemoveAttachment
}) => {
  return (
    <CreditStatusChecker>
      <div className="h-full flex flex-col min-h-0 bg-white">
        {/* Selected Template Display */}
        <div className="flex-shrink-0 px-6 pt-4">
          <SelectedTemplateCard
            template={getCurrentTemplate()}
            onTemplateSelect={onTemplateSelect}
            availableTemplates={availableTemplates}
            onViewTemplate={onViewTemplate}
          />
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex-shrink-0 px-6 py-2">
            <AttachmentPreview
              attachments={attachments}
              onRemoveAttachment={onRemoveAttachment}
            />
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 min-h-0 px-6">
          <ChatMessages
            messages={messages}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Message Input */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200">
          <MessageInputSection
            message={message}
            setMessage={setMessage}
            onSendMessage={onSendMessage}
            onKeyPress={onKeyPress}
            canSend={canSend}
            onFileUpload={onFileUpload}
            onToggleUrlInput={onToggleUrlInput}
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            onAddUrl={onAddUrl}
            onCancelUrl={onCancelUrl}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </CreditStatusChecker>
  );
};
