
import React, { useState, useEffect } from 'react';
import { AnalysisListSidebar } from './AnalysisListSidebar';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { AnalysisDynamicRightPanel } from './AnalysisDynamicRightPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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

  // Calculate panel sizes based on collapse states
  const getLeftPanelSize = () => {
    if (leftCollapsed) return 5; // Minimal size when collapsed
    return 25; // Default size when expanded
  };

  const getRightPanelSize = () => {
    if (rightCollapsed) return 5; // Minimal size when collapsed
    return 25; // Default size when expanded
  };

  const getChatPanelSize = () => {
    const leftSize = getLeftPanelSize();
    const rightSize = getRightPanelSize();
    return 100 - leftSize - rightSize; // Fill remaining space
  };

  return (
    <div className="h-full bg-[#F9FAFB]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel 
          defaultSize={getLeftPanelSize()} 
          minSize={leftCollapsed ? 5 : 15} 
          maxSize={leftCollapsed ? 5 : 40}
          size={getLeftPanelSize()}
        >
          <AnalysisListSidebar 
            selectedAnalysis={selectedAnalysis}
            onAnalysisSelect={onAnalysisSelect}
            onCollapseChange={setLeftCollapsed}
          />
        </ResizablePanel>
        
        {!leftCollapsed && <ResizableHandle withHandle />}
        
        <ResizablePanel 
          defaultSize={getChatPanelSize()} 
          minSize={30}
          size={getChatPanelSize()}
        >
          <AnalysisChatPanel {...chatPanelProps} />
        </ResizablePanel>
        
        {!rightCollapsed && <ResizableHandle withHandle />}
        
        <ResizablePanel 
          defaultSize={getRightPanelSize()} 
          minSize={rightCollapsed ? 5 : 15} 
          maxSize={rightCollapsed ? 5 : 40}
          size={getRightPanelSize()}
        >
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
