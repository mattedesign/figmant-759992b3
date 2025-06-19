
import React from 'react';
import { AnalysisChatContainer } from './analysis/components/AnalysisChatContainer';
import { useChatState } from './analysis/ChatStateManager';

interface ChatPageProps {
  selectedTemplate?: any;
}

export const ChatPage: React.FC<ChatPageProps> = ({ selectedTemplate }) => {
  const chatState = useChatState();

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0">
        <AnalysisChatContainer
          messages={chatState.messages}
          isAnalyzing={false}
          message={chatState.message}
          setMessage={chatState.setMessage}
          onSendMessage={() => {}}
          onKeyPress={() => {}}
          getCurrentTemplate={() => selectedTemplate}
          canSend={chatState.message.trim().length > 0}
          onFileUpload={() => {}}
          onToggleUrlInput={() => chatState.setShowUrlInput(!chatState.showUrlInput)}
          showUrlInput={chatState.showUrlInput}
          urlInput={chatState.urlInput}
          setUrlInput={chatState.setUrlInput}
          onAddUrl={() => {}}
          onCancelUrl={() => chatState.setShowUrlInput(false)}
          onTemplateSelect={() => {}}
          availableTemplates={[]}
          onViewTemplate={() => {}}
          attachments={chatState.attachments}
          onRemoveAttachment={(id) => chatState.setAttachments(chatState.attachments.filter(att => att.id !== id))}
        />
      </div>
    </div>
  );
};
