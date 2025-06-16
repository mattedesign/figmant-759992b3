
import React from 'react';
import { AnalysisPageHeader } from './AnalysisPageHeader';
import { PromptTemplateSelector } from './PromptTemplateSelector';
import { SelectedTemplateCard } from './SelectedTemplateCard';
import { AnalysisChatPanel } from './AnalysisChatPanel';

interface MobileAnalysisLayoutProps {
  promptTemplates: any[];
  promptsLoading: boolean;
  selectedPromptCategory: string;
  selectedPromptTemplate: string;
  onPromptCategoryChange: (category: string) => void;
  onPromptTemplateChange: (templateId: string) => void;
  bestPrompt: any;
  currentTemplate: any;
  showTemplateDetails: boolean;
  onToggleTemplateDetails: () => void;
  onClearTemplateSelection: () => void;
  getCategoryColor: (category: string) => string;
  chatPanelProps: any;
}

export const MobileAnalysisLayout: React.FC<MobileAnalysisLayoutProps> = ({
  promptTemplates,
  promptsLoading,
  selectedPromptCategory,
  selectedPromptTemplate,
  onPromptCategoryChange,
  onPromptTemplateChange,
  bestPrompt,
  currentTemplate,
  showTemplateDetails,
  onToggleTemplateDetails,
  onClearTemplateSelection,
  getCategoryColor,
  chatPanelProps
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <AnalysisPageHeader />
        </div>

        {/* Template Selection - Collapsible on Mobile */}
        <div className="space-y-3">
          <PromptTemplateSelector
            promptTemplates={promptTemplates}
            promptsLoading={promptsLoading}
            selectedPromptCategory={selectedPromptCategory}
            selectedPromptTemplate={selectedPromptTemplate}
            onPromptCategoryChange={onPromptCategoryChange}
            onPromptTemplateChange={onPromptTemplateChange}
            bestPrompt={bestPrompt}
          />

          {/* Selected Template Display - Compact Mobile */}
          <SelectedTemplateCard
            currentTemplate={currentTemplate}
            showTemplateDetails={showTemplateDetails}
            onToggleDetails={onToggleTemplateDetails}
            onClearSelection={onClearTemplateSelection}
            getCategoryColor={getCategoryColor}
          />
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <AnalysisChatPanel {...chatPanelProps} />
      </div>
    </div>
  );
};
