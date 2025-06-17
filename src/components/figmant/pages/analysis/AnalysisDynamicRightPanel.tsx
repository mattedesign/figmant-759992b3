
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getHeaderTitle = () => {
    return mode === 'templates' ? 'Templates' : 'Analysis Details';
  };

  return (
    <div className={`bg-white border-l border-gray-200 flex flex-col h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-full'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h3 className="font-semibold text-gray-900">{getHeaderTitle()}</h3>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
            title={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {isCollapsed ? (
              <PanelRightOpen className="h-4 w-4" />
            ) : (
              <PanelRightClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden">
          {mode === 'templates' ? (
            <TemplatesPanel
              promptTemplates={promptTemplates}
              selectedPromptTemplate={selectedPromptTemplate}
              onPromptTemplateSelect={onPromptTemplateSelect}
            />
          ) : (
            <AnalysisDetailsPanel
              currentAnalysis={currentAnalysis}
              attachments={attachments}
              onAnalysisClick={onAnalysisClick}
              onBackClick={onBackClick}
            />
          )}
        </div>
      )}

      {/* Collapsed state content */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-4">
          <div className="text-xs text-gray-400 writing-vertical-lr rotate-180 mt-8">
            {getHeaderTitle()}
          </div>
        </div>
      )}
    </div>
  );
};
