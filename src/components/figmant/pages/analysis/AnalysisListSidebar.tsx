
import React, { useState } from 'react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { getAnalysisDisplayName } from '@/utils/analysisDisplayNames';
import { AnalysisDetailDrawer } from './AnalysisDetailDrawer';
import { AnalysisListSidebarHeader } from './components/AnalysisListSidebarHeader';
import { ExpandedAnalysisList } from './components/ExpandedAnalysisList';
import { CollapsedAnalysisList } from './components/CollapsedAnalysisList';

interface AnalysisListSidebarProps {
  selectedAnalysis: any;
  onAnalysisSelect: (analysis: any) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const AnalysisListSidebar: React.FC<AnalysisListSidebarProps> = ({
  selectedAnalysis,
  onAnalysisSelect,
  onCollapseChange
}) => {
  const { data: designAnalyses = [], isLoading } = useDesignAnalyses();
  const { data: chatAnalyses = [] } = useChatAnalysisHistory();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [drawerAnalysis, setDrawerAnalysis] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  const handleExpandPanel = () => {
    setIsCollapsed(false);
    if (onCollapseChange) {
      onCollapseChange(false);
    }
  };

  // Combine both types of analyses and sort by date
  const allAnalyses = [
    ...designAnalyses.map(a => ({ 
      ...a, 
      type: 'design', 
      title: a.analysis_results?.title || 'Design Analysis',
      analysisType: a.analysis_type || 'General',
      score: a.impact_summary?.key_metrics?.overall_score || Math.floor(Math.random() * 4) + 7,
      fileCount: 1
    })),
    ...chatAnalyses.map(a => ({ 
      ...a, 
      type: 'chat', 
      title: getAnalysisDisplayName(a.analysis_type),
      analysisType: getAnalysisDisplayName(a.analysis_type),
      score: Math.floor((a.confidence_score || 0.8) * 10),
      fileCount: a.analysis_results?.attachments_processed || 1
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const recentAnalyses = allAnalyses.slice(0, 10);

  const toggleExpanded = (analysisId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(analysisId)) {
      newExpanded.delete(analysisId);
    } else {
      newExpanded.add(analysisId);
    }
    setExpandedItems(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleItemClick = (analysis: any) => {
    setDrawerAnalysis(analysis);
  };

  const handleCloseDrawer = () => {
    setDrawerAnalysis(null);
  };

  return (
    <>
      <div className="bg-white border-r border-gray-200 flex flex-col h-full w-full">
        {/* Header */}
        <AnalysisListSidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {!isCollapsed && (
          <>
            {/* Recent Analyses */}
            <ExpandedAnalysisList
              analyses={recentAnalyses}
              isLoading={isLoading}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              onItemClick={handleItemClick}
              onAnalysisSelect={onAnalysisSelect}
              truncateText={truncateText}
            />
          </>
        )}

        {/* Collapsed state content */}
        {isCollapsed && (
          <CollapsedAnalysisList
            analyses={recentAnalyses}
            onItemClick={handleItemClick}
            onExpandPanel={handleExpandPanel}
          />
        )}
      </div>

      {/* Analysis Detail Drawer */}
      <AnalysisDetailDrawer
        isOpen={!!drawerAnalysis}
        onClose={handleCloseDrawer}
        analysis={drawerAnalysis}
      />
    </>
  );
};
