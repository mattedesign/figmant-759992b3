
import React from 'react';
import { AnalysisChatInput } from '../AnalysisChatInput';
import { ChatMessage } from '@/components/design/DesignChatInterface';

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
  setUrlInput: (value: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
  onTemplateSelect: (templateId: string) => void;
  availableTemplates: any[];
  onViewTemplate: (template: any) => void;
  attachments: any[];
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
  console.log('📋 ANALYSIS CHAT CONTAINER - Rendering with:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    templatesCount: availableTemplates.length,
    showUrlInput,
    isAnalyzing
  });

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">Start your analysis</h3>
            <p>Upload files, add URLs, or select a template to get started with your design analysis.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 text-xs opacity-75">
                    {msg.attachments.length} attachment(s)
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {isAnalyzing && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Analyzing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-background">
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
          showUrlInput={showUrlInput}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          onAddUrl={onAddUrl}
          onCancelUrl={onCancelUrl}
        />
      </div>
    </div>
  );
};
