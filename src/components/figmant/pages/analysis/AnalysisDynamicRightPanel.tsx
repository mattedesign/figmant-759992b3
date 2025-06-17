
import React from 'react';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyRightPanel } from './components/EmptyRightPanel';
import { TemplatesPanel } from './components/TemplatesPanel';
import { AnalysisDetailsPanel } from './components/AnalysisDetailsPanel';
import { AttachmentPreview } from './AttachmentPreview';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';

interface AnalysisDynamicRightPanelProps {
  mode: 'empty' | 'templates' | 'analysis';
  promptTemplates?: ClaudePromptExample[];
  selectedPromptTemplate?: string;
  selectedPromptCategory?: string;
  onPromptTemplateSelect?: (templateId: string) => void;
  onPromptCategoryChange?: (category: string) => void;
  currentAnalysis?: any;
  attachments?: ChatAttachment[];
  onCollapseChange?: (collapsed: boolean) => void;
  onRemoveAttachment?: (id: string) => void;
  lastAnalysisResult?: any;
  onAnalysisClick?: () => void;
  onBackClick?: () => void;
}

export const AnalysisDynamicRightPanel: React.FC<AnalysisDynamicRightPanelProps> = ({
  mode,
  promptTemplates,
  selectedPromptTemplate,
  selectedPromptCategory,
  onPromptTemplateSelect,
  onPromptCategoryChange,
  currentAnalysis,
  attachments = [],
  onCollapseChange,
  onRemoveAttachment,
  lastAnalysisResult,
  onAnalysisClick,
  onBackClick
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  const renderContent = () => {
    if (isCollapsed) {
      return null;
    }

    switch (mode) {
      case 'templates':
        return (
          <TemplatesPanel
            promptTemplates={promptTemplates || []}
            selectedPromptTemplate={selectedPromptTemplate}
            onPromptTemplateSelect={onPromptTemplateSelect}
          />
        );
      case 'analysis':
        return (
          <AnalysisDetailsPanel
            currentAnalysis={currentAnalysis}
            attachments={attachments}
            onRemoveAttachment={onRemoveAttachment}
            lastAnalysisResult={lastAnalysisResult}
            onAnalysisClick={onAnalysisClick}
            onBackClick={onBackClick}
          />
        );
      default:
        return <EmptyRightPanel />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header with Context title and collapse button */}
      <div className="p-4 pb-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h3 className="font-semibold text-gray-900">Context</h3>}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleCollapse}
            className="h-8 w-8"
          >
            <History className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};
