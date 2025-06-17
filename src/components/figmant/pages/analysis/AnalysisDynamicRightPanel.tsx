
import React from 'react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { TemplatesPanel } from './components/TemplatesPanel';
import { AnalysisDetailsPanel } from './components/AnalysisDetailsPanel';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  business_domain?: string;
  claude_response?: string;
  created_at?: string;
  created_by?: string;
  effectiveness_rating?: number;
  is_active?: boolean;
  original_prompt?: string;
  use_case_context?: string;
}

interface AnalysisDynamicRightPanelProps {
  mode: 'templates' | 'analysis';
  promptTemplates?: PromptTemplate[];
  selectedPromptCategory?: string;
  selectedPromptTemplate?: string;
  onPromptTemplateSelect?: (templateId: string) => void;
  onPromptCategoryChange?: (category: string) => void;
  currentAnalysis?: any;
  attachments?: ChatAttachment[];
  onAnalysisClick?: () => void;
  onBackClick?: () => void;
}

export const AnalysisDynamicRightPanel: React.FC<AnalysisDynamicRightPanelProps> = ({
  mode,
  promptTemplates = [],
  selectedPromptTemplate,
  onPromptTemplateSelect,
  currentAnalysis,
  attachments = [],
  onAnalysisClick,
  onBackClick
}) => {
  if (mode === 'templates') {
    return (
      <TemplatesPanel
        promptTemplates={promptTemplates}
        selectedPromptTemplate={selectedPromptTemplate}
        onPromptTemplateSelect={onPromptTemplateSelect}
      />
    );
  }

  // Analysis mode
  return (
    <AnalysisDetailsPanel
      currentAnalysis={currentAnalysis}
      attachments={attachments}
      onAnalysisClick={onAnalysisClick}
      onBackClick={onBackClick}
    />
  );
};
