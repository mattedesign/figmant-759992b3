
import React from 'react';

interface CollapsedAnalysisListProps {
  analyses: any[];
  onItemClick: (analysis: any) => void;
  onExpandPanel?: () => void;
}

export const CollapsedAnalysisList: React.FC<CollapsedAnalysisListProps> = ({
  analyses,
  onItemClick,
  onExpandPanel
}) => {
  return (
    <div className="flex-1 flex flex-col items-center pt-4 space-y-4">
      {/* Empty collapsed state - no icon */}
    </div>
  );
};
