
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen, FileText, Layout } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { TemplatesPanel } from './components/TemplatesPanel';
import { AnalysisDetailsPanel } from './components/AnalysisDetailsPanel';
import { EmptyRightPanel } from './components/EmptyRightPanel';

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
  mode: 'templates' | 'analysis' | 'empty';
  promptTemplates?: PromptTemplate[];
  selectedPromptCategory?: string;
  selectedPromptTemplate?: string;
  onPromptTemplateSelect?: (templateId: string) => void;
  onPromptCategoryChange?: (category: string) => void;
  currentAnalysis?: any;
  attachments?: ChatAttachment[];
  onAnalysisClick?: () => void;
  onBackClick?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
  onRemoveAttachment?: (id: string) => void;
  lastAnalysisResult?: any;
}

export const AnalysisDynamicRightPanel: React.FC<AnalysisDynamicRightPanelProps> = ({
  mode,
  promptTemplates = [],
  selectedPromptTemplate,
  onPromptTemplateSelect,
  currentAnalysis,
  attachments = [],
  onAnalysisClick,
  onBackClick,
  onCollapseChange,
  onRemoveAttachment,
  lastAnalysisResult
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  const getHeaderTitle = () => {
    switch (mode) {
      case 'templates':
        return 'More';
      case 'analysis':
        return 'Analysis Details';
      case 'empty':
      default:
        return 'Analysis';
    }
  };

  const getModeIcon = () => {
    return mode === 'templates' ? Layout : FileText;
  };

  const renderContent = () => {
    switch (mode) {
      case 'templates':
        return (
          <TemplatesPanel
            promptTemplates={promptTemplates}
            selectedPromptTemplate={selectedPromptTemplate}
            onPromptTemplateSelect={onPromptTemplateSelect}
          />
        );
      case 'analysis':
        return (
          <AnalysisDetailsPanel
            currentAnalysis={currentAnalysis}
            attachments={attachments}
            onAnalysisClick={onAnalysisClick}
            onBackClick={onBackClick}
            onRemoveAttachment={onRemoveAttachment}
            lastAnalysisResult={lastAnalysisResult}
          />
        );
      case 'empty':
      default:
        return <EmptyRightPanel />;
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h3 className="font-semibold text-gray-900">{getHeaderTitle()}</h3>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleCollapse}
            className={`h-8 w-8 p-0 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}
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
          {renderContent()}
        </div>
      )}

      {/* Collapsed state content */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0 flex items-center justify-center"
            onClick={handleToggleCollapse}
            title={getHeaderTitle()}
          >
            {React.createElement(getModeIcon(), { className: "h-5 w-5" })}
          </Button>
        </div>
      )}
    </div>
  );
};
