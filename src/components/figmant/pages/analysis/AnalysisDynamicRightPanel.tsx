
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
          <div className="flex flex-col h-full">
            {/* Attachments Section */}
            {attachments.length > 0 && (
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Attachments</h3>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <AttachmentPreview
                      key={attachment.id}
                      attachment={attachment}
                      onRemove={onRemoveAttachment}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Analysis Results Section */}
            {(currentAnalysis || lastAnalysisResult) && (
              <div className="flex-1">
                <AnalysisDetailsPanel
                  currentAnalysis={currentAnalysis || lastAnalysisResult}
                />
              </div>
            )}
          </div>
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
            {isCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
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
