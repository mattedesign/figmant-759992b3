
import React from 'react';
import { AnalysisChatInput } from '../AnalysisChatInput';
import { ChatMessage } from '@/components/design/DesignChatInterface';
import { useAnalysisChatHandler } from '../hooks/useAnalysisChatHandler';

interface AnalysisChatContainerProps {
  messages: ChatMessage[];
  message: string;
  setMessage: (message: string) => void;
  setMessages?: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void; // Made optional
  getCurrentTemplate: () => any;
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
  isAnalyzing?: boolean;
  onSendMessage?: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  canSend?: boolean;
  onShowHistory?: () => void;
  currentSessionName?: string;
}

export const AnalysisChatContainer: React.FC<AnalysisChatContainerProps> = ({
  messages,
  message,
  setMessage,
  setMessages,
  getCurrentTemplate,
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
  onRemoveAttachment,
  isAnalyzing = false,
  onSendMessage,
  onKeyPress,
  canSend,
  onShowHistory,
  currentSessionName
}) => {
  const selectedTemplate = getCurrentTemplate();

  // Only use the hook if setMessages is provided (internal chat management)
  const shouldUseInternalHandler = !!setMessages;
  const {
    handleSendMessage,
    handleKeyPress,
    canSend: hookCanSend,
    isAnalyzing: hookIsAnalyzing
  } = useAnalysisChatHandler(message, setMessage, messages, setMessages || (() => {}),
  // Provide fallback
  attachments, newAttachments => {
    // This will be handled by parent component
  }, selectedTemplate);

  // Use props if provided, otherwise use hook values (only if internal handler should be used)
  const finalSendMessage = onSendMessage || (shouldUseInternalHandler ? handleSendMessage : () => {});
  const finalKeyPress = onKeyPress || (shouldUseInternalHandler ? handleKeyPress : () => {});
  const finalCanSend = canSend !== undefined ? canSend : shouldUseInternalHandler ? hookCanSend : false;
  const analyzing = isAnalyzing || (shouldUseInternalHandler ? hookIsAnalyzing : false);
  console.log('📋 ANALYSIS CHAT CONTAINER - Rendering with:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    templatesCount: availableTemplates.length,
    selectedTemplate: selectedTemplate?.title || 'None',
    isAnalyzing: analyzing,
    hasSetMessages: !!setMessages,
    shouldUseInternalHandler
  });
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <h3 className="text-lg font-medium mb-2">Start your analysis</h3>
            <p>Upload files, add URLs, or select a template to get started with your design analysis.</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
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
        {analyzing && (
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
      <div className="border-t bg-transparent max-w-[540px] w-full mx-auto">
        <AnalysisChatInput
          message={message}
          setMessage={setMessage}
          onSendMessage={finalSendMessage}
          onKeyPress={finalKeyPress}
          selectedPromptTemplate={selectedTemplate}
          canSend={finalCanSend}
          isAnalyzing={analyzing}
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
