
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { recentAnalyses, isLoading, expandedItems, toggleExpanded } = useRecentAnalysisData(analysisHistory);

  const handleToggleExpanded = (analysisId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleExpanded(analysisId);
  };

  const handleAnalysisClick = (analysis: any) => {
    if (analysis.type === 'chat') {
      // Navigate to chat page with historical analysis
      navigate('/figmant', { 
        state: { 
          activeSection: 'chat',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
      onSectionChange('chat');
    } else {
      // Navigate to wizard with historical context
      navigate('/figmant', { 
        state: { 
          activeSection: 'wizard',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
      onSectionChange('wizard');
    }
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
