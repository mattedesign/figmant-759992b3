
import React, { useState } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useAnalysisChatState } from '../hooks/useAnalysisChatState';
import { useAttachmentHandlers } from '@/components/design/chat/hooks/useAttachmentHandlers';
import { useFileUploadHandler } from '../useFileUploadHandler';
import { useMessageHandler } from '../useMessageHandler';

interface AnalysisChatStateProps {
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
  children: (props: AnalysisChatStateRenderProps) => React.ReactNode;
}

export interface AnalysisChatStateRenderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  figmantTemplates: any[];
  selectedTemplate: any;
  showTemplateModal: boolean;
  modalTemplate: any;
  getCurrentTemplate: () => any;
  handleTemplateSelect: (templateId: string) => void;
  handleViewTemplate: (template: any) => void;
  setShowTemplateModal: (show: boolean) => void;
  setModalTemplate: (template: any) => void;
  addUrlAttachment: (urlInput: string) => void;
  removeAttachment: (id: string) => void;
  handleFileUpload: (file: File) => void;
  isAnalyzing: boolean;
  canSend: boolean;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export const AnalysisChatState: React.FC<AnalysisChatStateProps> = ({
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
  selectedPromptCategory,
  promptTemplates,
  onAnalysisComplete,
  children
}) => {
  const [activeTab, setActiveTab] = useState("chat");
  
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
  } = useAnalysisChatState({ selectedPromptTemplate, onAnalysisComplete });

  const {
    addUrlAttachment: originalAddUrlAttachment,
    removeAttachment
  } = useAttachmentHandlers(attachments, setAttachments, setUrlInput, setShowUrlInput);

  const {
    handleFileUpload
  } = useFileUploadHandler(setAttachments);

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
    selectedPromptCategory,
    promptTemplates,
    onAnalysisComplete
  });

  // Wrapper function to match the expected signature
  const addUrlAttachment = (urlInput: string) => {
    originalAddUrlAttachment(urlInput);
  };

  return children({
    activeTab,
    setActiveTab,
    figmantTemplates,
    selectedTemplate,
    showTemplateModal,
    modalTemplate,
    getCurrentTemplate,
    handleTemplateSelect,
    handleViewTemplate,
    setShowTemplateModal,
    setModalTemplate,
    addUrlAttachment,
    removeAttachment,
    handleFileUpload,
    isAnalyzing,
    canSend,
    handleSendMessage,
    handleKeyPress
  });
};
