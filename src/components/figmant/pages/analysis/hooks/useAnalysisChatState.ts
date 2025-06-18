
import { useState, useEffect } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';

interface UseAnalysisChatStateProps {
  selectedPromptTemplate?: any;
  onAnalysisComplete?: (result: any) => void;
}

export const useAnalysisChatState = ({
  selectedPromptTemplate,
  onAnalysisComplete
}: UseAnalysisChatStateProps = {}) => {
  const { data: figmantTemplates = [] } = useClaudePromptExamples();
  
  // Default to Master UX Analysis template
  const masterTemplate = figmantTemplates.find(t => t.category === 'master') || figmantTemplates[0];
  const [selectedTemplate, setSelectedTemplate] = useState(selectedPromptTemplate?.id || masterTemplate?.id || 'master');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<any>(null);
  
  // FEATURE PARITY: Add tab management for both chat and wizard
  const [activeTab, setActiveTab] = useState<string>('chat');

  // File upload handler for feature parity
  const handleFileUpload = (file: File) => {
    console.log('🔍 ANALYSIS STATE - File upload requested:', file.name);
    // This would be implemented by the parent component
  };

  // URL attachment handler
  const addUrlAttachment = (url: string) => {
    console.log('🔍 ANALYSIS STATE - URL attachment requested:', url);
    // This would be implemented by the parent component
  };

  // Attachment removal handler
  const removeAttachment = (id: string) => {
    console.log('🔍 ANALYSIS STATE - Remove attachment requested:', id);
    // This would be implemented by the parent component
  };

  // Get the current template object
  const getCurrentTemplate = () => {
    return figmantTemplates.find(t => t.id === selectedTemplate) || 
           masterTemplate ||
           figmantTemplates[0];
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateModal(false);
  };

  const handleViewTemplate = (template: any) => {
    setModalTemplate(template);
    setShowTemplateModal(true);
  };

  const handleTemplateModalClose = () => {
    setShowTemplateModal(false);
    setModalTemplate(null);
  };

  return {
    figmantTemplates,
    selectedTemplate,
    showTemplateModal,
    modalTemplate,
    activeTab,
    setActiveTab,
    getCurrentTemplate,
    handleTemplateSelect,
    handleViewTemplate,
    setShowTemplateModal,
    setModalTemplate,
    handleTemplateModalClose,
    handleFileUpload,
    addUrlAttachment,
    removeAttachment
  };
};
