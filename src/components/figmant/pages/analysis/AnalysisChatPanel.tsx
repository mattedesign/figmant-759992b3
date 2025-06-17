
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChatAttachment, ChatMessage } from '@/components/design/DesignChatInterface';
import { ChatMessages } from './ChatMessages';
import { AttachmentPreview } from './AttachmentPreview';
import { URLInputSection } from './URLInputSection';
import { AnalysisChatHeader } from './AnalysisChatHeader';
import { AnalysisChatTabs } from './AnalysisChatTabs';
import { AnalysisChatInput } from './AnalysisChatInput';
import { AnalysisChatPlaceholder } from './AnalysisChatPlaceholder';
import { useAttachmentHandlers } from '@/components/design/chat/hooks/useAttachmentHandlers';
import { useFileUploadHandler } from './useFileUploadHandler';

interface AnalysisChatPanelProps {
  message: string;
  setMessage: (message: string) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
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
  onAnalysisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { addUrlAttachment, removeAttachment } = useAttachmentHandlers(
    attachments,
    setAttachments,
    setUrlInput,
    setShowUrlInput
  );

  const { handleFileUpload } = useFileUploadHandler(setAttachments);

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      attachments: attachments.length > 0 ? attachments : undefined,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessage('');
    setIsAnalyzing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Thank you for your submission. I\'m analyzing your design...',
        timestamp: new Date()
      };
      setMessages([...updatedMessages, aiResponse]);
      
      // Simulate analysis completion
      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalysisComplete?.({
          score: Math.floor(Math.random() * 3) + 8,
          status: 'Completed',
          title: 'Design Analysis Complete'
        });
      }, 2000);
    }, 1000);
  };

  const handleAddUrl = () => {
    addUrlAttachment(urlInput);
  };

  const handleFileUploadFromInput = (files: FileList) => {
    Array.from(files).forEach(handleFileUpload);
  };

  const canSend = message.trim().length > 0 || attachments.length > 0;
  const hasContent = messages.length > 0 || message.trim().length > 0 || attachments.length > 0;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Tabs moved to top */}
      <div className="p-6 border-b border-gray-200">
        <AnalysisChatHeader />
        <p className="text-gray-600 mb-4" style={{ fontSize: '12px' }}>
          Start with a task, and let Figmant complete it for you. Not sure where to start? try a template
        </p>

        <AnalysisChatTabs
          showUrlInput={showUrlInput}
          setShowUrlInput={setShowUrlInput}
          onFileSelect={() => {}} // This is no longer used since upload is in the input
        />
      </div>

      {/* Messages Area or Placeholder */}
      <div className="flex-1 overflow-y-auto">
        {hasContent ? (
          <div className="p-6">
            <ChatMessages messages={messages} isAnalyzing={isAnalyzing} />
          </div>
        ) : (
          <AnalysisChatPlaceholder />
        )}
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">Attachments</span>
            <Badge variant="secondary">{attachments.length}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {attachments.map((attachment) => (
              <AttachmentPreview
                key={attachment.id}
                attachment={attachment}
                onRemove={removeAttachment}
              />
            ))}
          </div>
        </div>
      )}

      {/* URL Input */}
      {showUrlInput && (
        <URLInputSection
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          onAddUrl={handleAddUrl}
          onCancel={() => setShowUrlInput(false)}
        />
      )}

      {/* Chat Input */}
      <AnalysisChatInput
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        selectedPromptTemplate={selectedPromptTemplate}
        canSend={canSend}
        onFileUpload={handleFileUploadFromInput}
        onToggleUrlInput={() => setShowUrlInput(!showUrlInput)}
      />
    </div>
  );
};
