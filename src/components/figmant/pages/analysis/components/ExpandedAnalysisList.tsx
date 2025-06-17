
import React from 'react';
import { AnalysisListItem } from './AnalysisListItem';

interface ExpandedAnalysisListProps {
  analyses: any[];
  isLoading: boolean;
  expandedItems: Set<string>;
  onToggleExpanded: (analysisId: string) => void;
  onItemClick: (analysis: any) => void;
  onAnalysisSelect: (analysis: any) => void;
  truncateText: (text: string, maxLength?: number) => string;
}

export const ExpandedAnalysisList: React.FC<ExpandedAnalysisListProps> = ({
  analyses,
  isLoading,
  expandedItems,
  onToggleExpanded,
  onItemClick,
  onAnalysisSelect,
  truncateText
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-sm text-gray-500">Loading analyses...</div>
          ) : analyses.length === 0 ? (
            <div className="text-sm text-gray-500">No analyses found</div>
          ) : (
            analyses.map((analysis) => (
              <AnalysisListItem
                key={`${analysis.type}-${analysis.id}`}
                analysis={analysis}
                isExpanded={expandedItems.has(`${analysis.type}-${analysis.id}`)}
                onToggleExpanded={onToggleExpanded}
                onItemClick={onItemClick}
                onAnalysisSelect={onAnalysisSelect}
                truncateText={truncateText}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
