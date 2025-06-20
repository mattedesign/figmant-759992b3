
import React, { useState } from 'react';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { useChatState } from './ChatStateManager';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { UserDebugPanel } from '@/components/debug/UserDebugPanel';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';

export const AnalysisPage: React.FC = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>();
  const chatState = useChatState();
  const { data: promptTemplates = [], isLoading } = useFigmantPromptTemplates();

  const handleSendMessage = () => {
    console.log('Sending message with:', {
      message: chatState.message,
      attachments: chatState.attachments,
      selectedTemplate
    });
    // Add actual message sending logic here
  };

  const handleAddAttachment = () => {
    console.log('Adding attachment...');
    // Add attachment logic here
  };

  const handleRemoveAttachment = (id: string) => {
    const updatedAttachments = chatState.attachments.filter(att => att.id !== id);
    chatState.setAttachments(updatedAttachments);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    console.log('Selected template:', templateId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Debug Toggle Button */}
      <div className="p-2 border-b border-gray-200 bg-gray-50">
        <Button
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Bug className="h-4 w-4" />
          {showDebugPanel ? 'Hide' : 'Show'} Debug Info
        </Button>
      </div>

      <div className="flex-1 flex">
        {/* Main Chat Panel */}
        <div className={`${showDebugPanel ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          <AnalysisChatPanel
            messages={chatState.messages}
            setMessages={chatState.setMessages}
            message={chatState.message}
            setMessage={chatState.setMessage}
            attachments={chatState.attachments}
            onSendMessage={handleSendMessage}
            onAddAttachment={handleAddAttachment}
            onRemoveAttachment={handleRemoveAttachment}
            promptTemplates={promptTemplates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            isAnalyzing={false}
          />
        </div>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="w-1/3 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
            <UserDebugPanel />
          </div>
        )}
      </div>
    </div>
  );
};
