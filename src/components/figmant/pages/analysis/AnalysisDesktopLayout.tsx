
import React, { useState, useEffect } from 'react';
import { AnalysisListSidebar } from './AnalysisListSidebar';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { AnalysisDynamicRightPanel } from './AnalysisDynamicRightPanel';

interface AnalysisDesktopLayoutProps {
  selectedAnalysis: any;
  onAnalysisSelect: (analysis: any) => void;
  chatPanelProps: any;
  rightPanelMode: 'templates' | 'analysis';
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
  rightPanelMode,
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
  const [rightCollapsed, setRightCollapsed] = useState(false);

  return (
    <div className="h-full bg-[#F9FAFB] flex">
      {/* Left Sidebar */}
      <div className={`flex-shrink-0 transition-all duration-300 ${
        leftCollapsed ? 'w-12' : 'w-80'
      }`}>
        <AnalysisListSidebar 
          selectedAnalysis={selectedAnalysis}
          onAnalysisSelect={onAnalysisSelect}
          onCollapseChange={setLeftCollapsed}
        />
      </div>
      
      {/* Main Chat Content */}
      <div className="flex-1 min-w-0">
        <AnalysisChatPanel {...chatPanelProps} />
      </div>
      
      {/* Right Panel */}
      <div className={`flex-shrink-0 transition-all duration-300 ${
        rightCollapsed ? 'w-12' : 'w-80'
      }`}>
        <AnalysisDynamicRightPanel
          mode={rightPanelMode}
          promptTemplates={promptTemplates}
          selectedPromptCategory={selectedPromptCategory}
          selectedPromptTemplate={selectedPromptTemplate}
          onPromptTemplateSelect={onPromptTemplateSelect}
          onPromptCategoryChange={onPromptCategoryChange}
          currentAnalysis={currentAnalysis}
          attachments={attachments}
          onAnalysisClick={onAnalysisClick}
          onBackClick={onBackClick}
          onCollapseChange={setRightCollapsed}
        />
      </div>
    </div>
  );
};
