
import React from 'react';
import { AnalysisChatContainer } from './analysis/components/AnalysisChatContainer';
import { useChatState } from './analysis/ChatStateManager';

interface ChatPageProps {
  selectedTemplate?: any;
}

export const ChatPage: React.FC<ChatPageProps> = ({ selectedTemplate }) => {
  const chatState = useChatState();

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB] min-h-0">
      <div className="px-6 pt-6 pb-3 bg-transparent flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat Analysis</h1>
            <p className="text-gray-600 mt-1">AI-powered design analysis through conversation</p>
          </div>
        </div>
      </div>

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
