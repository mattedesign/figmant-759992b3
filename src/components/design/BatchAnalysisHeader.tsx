
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, RefreshCw } from 'lucide-react';
import { DesignBatchAnalysis } from '@/types/design';

interface BatchAnalysisHeaderProps {
  batchAnalysis: DesignBatchAnalysis;
  modificationHistoryLength: number;
  selectedVersion: DesignBatchAnalysis;
  onBack: () => void;
  onModifyClick: () => void;
}

export const BatchAnalysisHeader = ({
  batchAnalysis,
  modificationHistoryLength,
  selectedVersion,
  onBack,
  onModifyClick
}: BatchAnalysisHeaderProps) => {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="text-sm text-muted-foreground">
          Dashboard → Batch Analysis
        </div>
      </div>

      {/* Title and Actions */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h1 className="text-2xl font-bold">Batch Comparative Analysis</h1>
            {modificationHistoryLength > 1 && (
              <Badge variant="outline">
                v{selectedVersion.version_number}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onModifyClick}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Modify & Re-run
          </Button>
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            {selectedVersion.analysis_type}
          </Badge>
        </div>
      </div>
    </div>
  );
};
