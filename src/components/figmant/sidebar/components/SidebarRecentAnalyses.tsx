
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';
import { useRecentAnalysisData } from './hooks/useRecentAnalysisData';
import { RecentAnalysisItem } from './RecentAnalysisItem';
import { RecentAnalysesEmptyState } from './RecentAnalysesEmptyState';

interface SidebarRecentAnalysesProps {
  analysisHistory: SavedChatAnalysis[];
  onSectionChange: (section: string) => void;
}

export const SidebarRecentAnalyses: React.FC<SidebarRecentAnalysesProps> = ({
  analysisHistory,
  onSectionChange
}) => {
  const { recentAnalyses, isLoading, expandedItems, toggleExpanded } = useRecentAnalysisData(analysisHistory);

  console.log('🔍 SidebarRecentAnalyses: Rendering with data:', {
    analysisHistoryCount: analysisHistory.length,
    recentAnalysesCount: recentAnalyses.length,
    isLoading,
    expandedItemsCount: expandedItems.size
  });

  const handleToggleExpanded = (analysisId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('🔍 SidebarRecentAnalyses: Toggle expanded for:', analysisId);
    toggleExpanded(analysisId);
  };

  // This function is now just a placeholder since each item handles its own modal
  const handleAnalysisClick = (analysis: any) => {
    console.log('🔍 SidebarRecentAnalyses: Analysis click handled by individual item:', analysis.id);
  };

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-1">
        {isLoading || recentAnalyses.length === 0 ? (
          <RecentAnalysesEmptyState isLoading={isLoading} />
        ) : (
          recentAnalyses.map((analysis) => {
            const analysisId = `${analysis.type}-${analysis.id}`;
            const isExpanded = expandedItems.has(analysisId);
            
            console.log('🔍 SidebarRecentAnalyses: Rendering analysis item:', {
              analysisId,
              title: analysis.title || analysis.displayTitle,
              isExpanded
            });
            
            return (
              <RecentAnalysisItem
                key={analysisId}
                analysis={analysis}
                isExpanded={isExpanded}
                onToggleExpanded={handleToggleExpanded}
                onAnalysisClick={handleAnalysisClick}
              />
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};
