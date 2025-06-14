
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DesignBatchAnalysis } from '@/types/design';
import { Eye, BarChart3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BatchAnalysisListItemProps {
  batchAnalysis: DesignBatchAnalysis;
  onViewBatchAnalysis?: (batchAnalysis: DesignBatchAnalysis) => void;
}

export const BatchAnalysisListItem: React.FC<BatchAnalysisListItemProps> = ({
  batchAnalysis,
  onViewBatchAnalysis
}) => {
  const overallScore = batchAnalysis.impact_summary?.key_metrics?.overall_score || 0;

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg border-l-4 border-l-blue-500">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-blue-600" />
        <div>
          <p className="font-medium text-sm flex items-center gap-2">
            Batch Comparative Analysis
            {batchAnalysis.version_number && batchAnalysis.version_number > 1 && (
              <Badge variant="outline" className="text-xs">
                v{batchAnalysis.version_number}
              </Badge>
            )}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{batchAnalysis.analysis_type}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(batchAnalysis.created_at))} ago</span>
            {overallScore > 0 && (
              <>
                <span>•</span>
                <Badge variant="outline" className="text-xs">
                  Score: {overallScore}/10
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          Batch
        </Badge>
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
    </div>
  );
};
