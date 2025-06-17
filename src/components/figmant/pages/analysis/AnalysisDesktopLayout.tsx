
import React, { useState, useEffect } from 'react';
import { AnalysisListSidebar } from './AnalysisListSidebar';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { AnalysisDynamicRightPanel } from './AnalysisDynamicRightPanel';

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
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  // Determine the right panel mode based on state
  const getRightPanelMode = () => {
    // If there's an active analysis or analysis result, show analysis details
    if (currentAnalysis || chatPanelProps.lastAnalysisResult || chatPanelProps.messages?.length > 0) {
      return 'analysis';
    }
    // If there are attachments or user is actively engaged, show templates
    if (attachments?.length > 0 || chatPanelProps.message?.length > 0) {
      return 'templates';
    }
    // Default to empty state
    return 'empty';
  };

  const getLeftPanelWidth = () => {
    return leftCollapsed ? 'w-16' : 'w-1/4'; // 25% when expanded, 64px when collapsed
  };

  const getRightPanelWidth = () => {
    // Hide right panel when wizard tab is active
    if (activeTab === 'wizard') return 'w-0';
    return rightCollapsed ? 'w-16' : 'w-1/4'; // 25% when expanded, 64px when collapsed
  };

  const getMainContentWidth = () => {
    // Full width minus left panel when wizard tab is active
    if (activeTab === 'wizard') {
      return leftCollapsed ? 'calc(100% - 4rem)' : 'calc(75%)';
    }
    
    if (leftCollapsed && rightCollapsed) {
      return 'calc(100% - 8rem)'; // Both panels collapsed (64px each)
    } else if (leftCollapsed || rightCollapsed) {
      return 'calc(75% - 4rem)'; // One panel collapsed
    } else {
      return 'w-1/2'; // 50% when both expanded
    }
  };

  // Enhanced chat panel props with tab state management
  const enhancedChatPanelProps = {
    ...chatPanelProps,
    activeTab,
    setActiveTab,
    onActiveTabChange: setActiveTab
  };

  return (
    <div className="h-full bg-[#F9FAFB] flex">
      {/* Left Sidebar */}
      <div className={`flex-shrink-0 transition-all duration-300 ${getLeftPanelWidth()}`}>
        <AnalysisListSidebar 
          selectedAnalysis={selectedAnalysis}
          onAnalysisSelect={onAnalysisSelect}
          onCollapseChange={setLeftCollapsed}
        />
      </div>
      
      {/* Main Chat Content */}
      <div 
        className="flex-1 min-w-0 transition-all duration-300"
        style={{ width: getMainContentWidth() }}
      >
        <AnalysisChatPanel 
          {...enhancedChatPanelProps}
          promptTemplates={promptTemplates}
          selectedPromptCategory={selectedPromptCategory}
          selectedPromptTemplate={selectedPromptTemplate}
        />
      </div>
      
      {/* Right Panel - Hidden when wizard tab is active */}
      {activeTab !== 'wizard' && (
        <div className={`flex-shrink-0 transition-all duration-300 ${getRightPanelWidth()}`}>
          <AnalysisDynamicRightPanel
            mode={getRightPanelMode()}
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
            onRemoveAttachment={chatPanelProps.onRemoveAttachment}
            lastAnalysisResult={chatPanelProps.lastAnalysisResult}
          />
        </div>
      )}
    </div>
  );
};
