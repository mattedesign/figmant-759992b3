
import React, { useState, useCallback } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useMessageHandler } from '../useMessageHandler';
import { useAnalysisChatState } from '../hooks/useAnalysisChatState';

interface AnalysisChatStateProps {
  selectedPromptTemplate?: any;
  onAnalysisComplete?: (result: any) => void;
  children?: (stateProps: any) => React.ReactElement;
}

export const AnalysisChatState: React.FC<AnalysisChatStateProps> = ({
  selectedPromptTemplate,
  onAnalysisComplete,
  children
}) => {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);

  // Template state
  const {
    figmantTemplates,
    selectedTemplate,
    showTemplateModal,
    modalTemplate,
    getCurrentTemplate,
    handleTemplateSelect,
    handleViewTemplate,
    setShowTemplateModal,
    setModalTemplate
  } = useAnalysisChatState({
    selectedPromptTemplate,
    onAnalysisComplete
  });

  // Message handler
  const {
    isAnalyzing,
    canSend,
    handleSendMessage,
    handleKeyPress
  } = useMessageHandler({
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    selectedPromptTemplate: getCurrentTemplate(),
    selectedPromptCategory: getCurrentTemplate()?.category,
    promptTemplates: figmantTemplates,
    onAnalysisComplete
  });

  const handleTemplateModalClose = useCallback(() => {
    setShowTemplateModal(false);
    setModalTemplate(null);
  }, [setShowTemplateModal, setModalTemplate]);

  // If children prop is provided, use render props pattern
  if (children) {
    return children({
      messages,
      setMessages,
      message,
      setMessage,
      attachments,
      setAttachments,
      isAnalyzing,
      canSend,
      handleSendMessage,
      handleKeyPress,
      figmantTemplates,
      selectedTemplate,
      showTemplateModal,
      modalTemplate,
      getCurrentTemplate,
      handleTemplateSelect,
      handleViewTemplate,
      setShowTemplateModal,
      setModalTemplate,
      handleTemplateModalClose
    });
  }

  // Default render when no children provided
  return (
    <div className="flex flex-col h-full">
      {/* Template Selection Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Analysis Template</h3>
            <p className="text-sm text-gray-600">
              {getCurrentTemplate()?.display_name || 'Master UX Analysis'}
            </p>
          </div>
          <button
            onClick={() => handleViewTemplate(getCurrentTemplate())}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Change Template
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        {/* This would need to be implemented based on the actual chat interface structure */}
        <div className="p-4">
          <p>Chat interface would go here</p>
        </div>
      </div>
    </div>
  );
};
