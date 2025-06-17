
import { useState, useEffect } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useFigmantPromptTemplates } from '@/hooks/useFigmantChatAnalysis';

interface UseAnalysisChatStateProps {
  selectedPromptTemplate?: any;
  onAnalysisComplete?: (result: any) => void;
}

export const useAnalysisChatState = ({
  selectedPromptTemplate,
  onAnalysisComplete
}: UseAnalysisChatStateProps = {}) => {
  const { data: figmantTemplates = [] } = useFigmantPromptTemplates();
  
  // Default to Master UX Analysis template
  const masterTemplate = figmantTemplates.find(t => t.category === 'master') || figmantTemplates[0];
  const [selectedTemplate, setSelectedTemplate] = useState(selectedPromptTemplate?.id || masterTemplate?.id || 'master');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<any>(null);

  // Get the current template object
  const getCurrentTemplate = () => {
    return figmantTemplates.find(t => t.id === selectedTemplate) || 
           masterTemplate ||
           figmantTemplates[0];
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleViewTemplate = (template: any) => {
    setModalTemplate(template);
    setShowTemplateModal(true);
  };

  return {
    figmantTemplates,
    selectedTemplate,
    showTemplateModal,
    modalTemplate,
    getCurrentTemplate,
    handleTemplateSelect,
    handleViewTemplate,
    setShowTemplateModal
  };
};
