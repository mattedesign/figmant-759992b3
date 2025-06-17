
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

  // Calculate panel sizes dynamically based on collapsed states
  const getLeftPanelSize = () => leftCollapsed ? 3 : 25;
  const getRightPanelSize = () => rightCollapsed ? 3 : 25;
  const getChatPanelSize = () => {
    const leftSize = getLeftPanelSize();
    const rightSize = getRightPanelSize();
    return 100 - leftSize - rightSize;
  };

  return (
    <div className="h-full bg-[#F9FAFB]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel 
          defaultSize={getLeftPanelSize()} 
          minSize={leftCollapsed ? 3 : 15} 
          maxSize={leftCollapsed ? 3 : 40}
          collapsible={true}
          collapsedSize={3}
        >
          <AnalysisListSidebar 
            selectedAnalysis={selectedAnalysis}
            onAnalysisSelect={onAnalysisSelect}
            onCollapseChange={setLeftCollapsed}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle className={leftCollapsed ? "opacity-0 pointer-events-none" : ""} />
        
        <ResizablePanel 
          defaultSize={getChatPanelSize()} 
          minSize={30}
        >
          <AnalysisChatPanel {...chatPanelProps} />
        </ResizablePanel>
        
        <ResizableHandle withHandle className={rightCollapsed ? "opacity-0 pointer-events-none" : ""} />
        
        <ResizablePanel 
          defaultSize={getRightPanelSize()} 
          minSize={rightCollapsed ? 3 : 15} 
          maxSize={rightCollapsed ? 3 : 40}
          collapsible={true}
          collapsedSize={3}
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
