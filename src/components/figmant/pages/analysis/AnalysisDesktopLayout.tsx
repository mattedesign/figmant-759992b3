
import React, { useState } from 'react';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { FigmantSidebar } from '@/components/figmant/sidebar/FigmantSidebarContainer';

interface AnalysisDesktopLayoutProps {
  selectedAnalysis: any;
  onAnalysisSelect: (analysis: any) => void;
  chatPanelProps: any;
  rightPanelMode: 'templates' | 'analysis' | 'empty';
  promptTemplates: any[];
  selectedPromptCategory: string;
  selectedPromptTemplate: string;
  onPromptTemplateSelect: (templateId: string) => void;
  onPromptCategoryChange: (category: string) => void;
  currentAnalysis: any;
  attachments: any[];
  onAnalysisClick: () => void;
  onBackClick?: () => void;
}

export const AnalysisDesktopLayout: React.FC<AnalysisDesktopLayoutProps> = ({
  selectedAnalysis,
  onAnalysisSelect,
  chatPanelProps,
  promptTemplates,
  selectedPromptCategory,
  selectedPromptTemplate,
  onPromptTemplateSelect,
  onPromptCategoryChange,
  currentAnalysis,
  attachments,
  onAnalysisClick,
  onBackClick
}) => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);

  const handleAnalysisSelect = (analysisId: string) => {
    // Convert section change to analysis selection if needed
    if (analysisId === 'chat') {
      onAnalysisSelect(null);
    } else {
      // Find analysis by ID or handle appropriately
      onAnalysisSelect({ id: analysisId });
    }
  };

  const handleCollapseChange = (collapsed: boolean) => {
    setLeftCollapsed(collapsed);
  };

  return (
    <div className="h-full bg-[#F9FAFB] flex gap-4">
      {/* Unified Figmant Sidebar */}
      <div className="flex-shrink-0">
        <FigmantSidebar
          activeSection={selectedAnalysis?.id || 'chat'}
          onSectionChange={handleAnalysisSelect}
          onCollapsedChange={handleCollapseChange}
        />
      </div>
      
      {/* Main Chat Content */}
      <div className="flex-1 min-w-0">
        <AnalysisChatPanel 
          {...chatPanelProps}
          promptTemplates={promptTemplates}
          selectedPromptCategory={selectedPromptCategory}
          selectedPromptTemplate={selectedPromptTemplate}
        />
      </div>
    </div>
  );
};
