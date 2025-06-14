
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DesignBatchAnalysis } from '@/types/design';
import { Eye, BarChart3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BatchAnalysesInsightsListProps {
  batchAnalyses: DesignBatchAnalysis[];
  onViewBatchAnalysis?: (batchAnalysis: DesignBatchAnalysis) => void;
}

export const BatchAnalysesInsightsList: React.FC<BatchAnalysesInsightsListProps> = ({
  batchAnalyses,
  onViewBatchAnalysis
}) => {
  return (
    <div className="space-y-2">
      {batchAnalyses.map((batchAnalysis) => (
        <div key={batchAnalysis.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              Batch Analysis
              {batchAnalysis.version_number && batchAnalysis.version_number > 1 && (
                <Badge variant="outline" className="text-xs">
                  v{batchAnalysis.version_number}
                </Badge>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {batchAnalysis.analysis_type} • {formatDistanceToNow(new Date(batchAnalysis.created_at))} ago
            </p>
          </div>
          {onViewBatchAnalysis && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewBatchAnalysis(batchAnalysis)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
