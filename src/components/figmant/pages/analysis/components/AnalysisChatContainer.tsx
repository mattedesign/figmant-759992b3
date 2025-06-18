
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { ChatMessages } from '../ChatMessages';
import { MessageInputSection } from '../MessageInputSection';
import { SelectedTemplateCard } from '../SelectedTemplateCard';
import { AttachmentPreview } from '../AttachmentPreview';
import { CreditStatusChecker } from './CreditStatusChecker';
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
  const getCategoryColor = (category: string) => {
    const colors = {
      master: 'bg-purple-100 text-purple-800',
      competitor: 'bg-blue-100 text-blue-800',
      revenue: 'bg-green-100 text-green-800',
      testing: 'bg-orange-100 text-orange-800',
      messaging: 'bg-pink-100 text-pink-800',
      hierarchy: 'bg-indigo-100 text-indigo-800',
      seasonal: 'bg-yellow-100 text-yellow-800',
      mobile: 'bg-teal-100 text-teal-800',
      accessibility: 'bg-gray-100 text-gray-800',
      design_system: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <CreditStatusChecker>
      <div className="h-full flex flex-col bg-white">
        {/* Fixed Header Content - Selected Template and Attachments */}
        <div className="flex-shrink-0 border-b border-gray-100">
          {/* Selected Template Display */}
          <div className="px-6 pt-4 pb-2">
            <SelectedTemplateCard
              currentTemplate={getCurrentTemplate()}
              showTemplateDetails={true}
              onToggleDetails={() => {}}
              onClearSelection={() => {}}
              getCategoryColor={getCategoryColor}
            />
          </div>

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="px-6 pb-4 space-y-2">
              {attachments.map((attachment) => (
                <AttachmentPreview
                  key={attachment.id}
                  attachment={attachment}
                  onRemove={onRemoveAttachment}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Messages Area */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="px-6 py-4">
              <ChatMessages
                messages={messages}
                isAnalyzing={isAnalyzing}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Fixed Message Input */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white">
          <div className="p-6">
            <MessageInputSection
              message={message}
              onMessageChange={setMessage}
              onSendMessage={onSendMessage}
              onKeyPress={onKeyPress}
              onFileUpload={onFileUpload}
              onToggleUrlInput={onToggleUrlInput}
              isAnalyzing={isAnalyzing}
              canSend={canSend}
            />
          </div>
        </div>
      </div>
    </CreditStatusChecker>
  );
};
