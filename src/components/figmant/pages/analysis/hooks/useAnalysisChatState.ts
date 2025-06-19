
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
  
  // Default to Master UX Analysis template or first available template
  const masterTemplate = figmantTemplates.find(t => t.category === 'master') || figmantTemplates[0];
  const [selectedTemplate, setSelectedTemplate] = useState(selectedPromptTemplate?.id || masterTemplate?.id || '');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<any>(null);
  
  // FEATURE PARITY: Add tab management for both chat and wizard
  const [activeTab, setActiveTab] = useState<string>('chat');

  // Update selected template when templates load or prop changes
  useEffect(() => {
    if (selectedPromptTemplate?.id) {
      setSelectedTemplate(selectedPromptTemplate.id);
    } else if (!selectedTemplate && masterTemplate?.id) {
      setSelectedTemplate(masterTemplate.id);
    }
  }, [selectedPromptTemplate?.id, masterTemplate?.id, selectedTemplate]);

  // Get the current template object
  const getCurrentTemplate = () => {
    const template = figmantTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      console.log('🎯 ANALYSIS STATE - Current template found:', template.title || template.display_name);
      return template;
    }
    
    console.log('🎯 ANALYSIS STATE - Template not found, using master or first available');
    return masterTemplate || figmantTemplates[0];
  };

  const handleTemplateSelect = (templateId: string) => {
    console.log('🎯 ANALYSIS STATE - Template selected:', templateId);
    setSelectedTemplate(templateId);
    setShowTemplateModal(false);
  };

  const handleViewTemplate = (template: any) => {
    console.log('🎯 ANALYSIS STATE - View template:', template);
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
    handleTemplateModalClose
  };
};
