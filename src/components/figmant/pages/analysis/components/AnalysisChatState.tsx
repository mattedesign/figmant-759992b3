
import React, { useState } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useAnalysisChatState } from '../hooks/useAnalysisChatState';
import { useMessageHandler } from '../useMessageHandler';
import { useFileUploadHandler } from '../useFileUploadHandler';

interface AnalysisChatStateProps {
  children: (props: AnalysisChatStateRenderProps) => React.ReactNode;
  selectedPromptTemplate?: any;
  onAnalysisComplete?: (result: any) => void;
}

interface AnalysisChatStateRenderProps {
  // State
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  message: string;
  setMessage: (message: string) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[]) => void;
  
  // Tab management
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Template management
  figmantTemplates: any[];
  getCurrentTemplate: () => any;
  handleTemplateSelect: (templateId: string) => void;
  handleViewTemplate: (template: any) => void;
  showTemplateModal: boolean;
  modalTemplate: any;
  handleTemplateModalClose: () => void;
  
  // Message handling
  isAnalyzing: boolean;
  canSend: boolean;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  
  // File handling
  handleFileUpload: (file: File) => void;
  addUrlAttachment: (url: string) => void;
  removeAttachment: (id: string) => void;
}

export const AnalysisChatState: React.FC<AnalysisChatStateProps> = ({
  children,
  selectedPromptTemplate,
  onAnalysisComplete
}) => {
  // Basic state management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);

  // Analysis chat state hook
  const analysisState = useAnalysisChatState({
    selectedPromptTemplate,
    onAnalysisComplete
  });

  // Message handler
  const messageHandler = useMessageHandler({
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    selectedPromptTemplate: analysisState.getCurrentTemplate(),
    selectedPromptCategory: analysisState.getCurrentTemplate()?.category,
    promptTemplates: analysisState.figmantTemplates,
    onAnalysisComplete
  });

  // File upload handler
  const fileUploadHandler = useFileUploadHandler({
    attachments,
    setAttachments
  });

  const addUrlAttachment = (url: string) => {
    if (!url.trim()) return;
    
    const urlAttachment: ChatAttachment = {
      id: crypto.randomUUID(),
      type: 'url',
      name: url,
      url: url,
      status: 'uploaded'
    };
    
    setAttachments(prev => [...prev, urlAttachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const renderProps: AnalysisChatStateRenderProps = {
    // State
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    
    // Tab management
    activeTab: analysisState.activeTab,
    setActiveTab: analysisState.setActiveTab,
    
    // Template management
    figmantTemplates: analysisState.figmantTemplates,
    getCurrentTemplate: analysisState.getCurrentTemplate,
    handleTemplateSelect: analysisState.handleTemplateSelect,
    handleViewTemplate: analysisState.handleViewTemplate,
    showTemplateModal: analysisState.showTemplateModal,
    modalTemplate: analysisState.modalTemplate,
    handleTemplateModalClose: analysisState.handleTemplateModalClose,
    
    // Message handling
    isAnalyzing: messageHandler.isAnalyzing,
    canSend: messageHandler.canSend,
    handleSendMessage: messageHandler.handleSendMessage,
    handleKeyPress: messageHandler.handleKeyPress,
    
    // File handling
    handleFileUpload: fileUploadHandler.handleFileUpload,
    addUrlAttachment,
    removeAttachment
  };

  return <>{children(renderProps)}</>;
};
