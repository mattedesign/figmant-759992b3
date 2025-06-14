
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Target } from 'lucide-react';
import { EnhancedImpactSummary } from './EnhancedImpactSummary';
import { AnalysisResults } from './chat/AnalysisResults';

interface AnalysisResultsViewerProps {
  analysisData: any;
  upload?: any;
  title?: string;
  type?: 'individual' | 'batch';
}

export const DesignAnalysisResultsViewer: React.FC<AnalysisResultsViewerProps> = ({
  analysisData,
  upload,
  title,
  type = 'individual'
}) => {
  const hasImpactSummary = analysisData?.impact_summary;
  const overallScore = hasImpactSummary?.key_metrics?.overall_score || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {title || (type === 'batch' ? 'Batch Analysis Complete' : 'Analysis Complete')}
            </div>
            {overallScore > 0 && (
              <Badge variant="default" className="text-lg px-3 py-1">
                {overallScore}/10
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                Completed {new Date(analysisData.created_at).toLocaleString()}
              </span>
            </div>
            <Badge variant="outline">
              {type === 'batch' ? 'Batch Analysis' : 'Individual Analysis'}
            </Badge>
            {analysisData.confidence_score && (
              <Badge variant="secondary">
                {Math.round(analysisData.confidence_score * 100)}% Confidence
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Impact Summary */}
      {hasImpactSummary && (
        <EnhancedImpactSummary 
          impactSummary={analysisData.impact_summary}
          winnerUploadId={type === 'batch' ? analysisData.winner_upload_id : upload?.id}
          designFileName={upload?.file_name}
        />
      )}

      {/* Detailed Analysis Results */}
      <AnalysisResults
        lastAnalysisResult={analysisData.analysis_results || analysisData}
        uploadIds={upload ? [upload.id] : []}
      />
    </div>
  );
};
