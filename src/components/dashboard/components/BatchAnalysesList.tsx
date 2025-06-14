
import React from 'react';
import { DesignBatchAnalysis } from '@/types/design';
import { BarChart3 } from 'lucide-react';
import { BatchAnalysisListItem } from './BatchAnalysisListItem';

interface BatchAnalysesListProps {
  batchAnalyses: DesignBatchAnalysis[];
  onViewBatchAnalysis?: (batchAnalysis: DesignBatchAnalysis) => void;
}

export const BatchAnalysesList: React.FC<BatchAnalysesListProps> = ({
  batchAnalyses,
  onViewBatchAnalysis
}) => {
  if (batchAnalyses.length === 0) {
    return (
      <div className="text-center py-4">
        <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No batch analyses yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {batchAnalyses.map((batchAnalysis) => (
        <BatchAnalysisListItem
          key={batchAnalysis.id}
          batchAnalysis={batchAnalysis}
          onViewBatchAnalysis={onViewBatchAnalysis}
        />
      ))}
    </div>
  );
};
