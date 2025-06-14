
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Target, BarChart3, FileImage } from 'lucide-react';
import { EnhancedImpactSummary } from './EnhancedImpactSummary';
import { AnalysisResults } from './chat/AnalysisResults';

interface UnifiedAnalysisResultsViewerProps {
  analysisData: any;
  analysisType: 'individual' | 'batch';
  upload?: any;
  uploads?: any[];
  title?: string;
}

export const UnifiedAnalysisResultsViewer: React.FC<UnifiedAnalysisResultsViewerProps> = ({
  analysisData,
  analysisType,
  upload,
  uploads = [],
  title
}) => {
  const hasImpactSummary = analysisData?.impact_summary;
  const overallScore = hasImpactSummary?.key_metrics?.overall_score || 0;

  // Get the appropriate icon and title based on analysis type
  const getHeaderIcon = () => {
    return analysisType === 'batch' ? (
      <BarChart3 className="h-5 w-5 text-blue-600" />
    ) : (
      <FileImage className="h-5 w-5 text-green-500" />
    );
  };

  const getDefaultTitle = () => {
    if (title) return title;
    return analysisType === 'batch' 
      ? 'Batch Comparative Analysis' 
      : 'Individual Design Analysis';
  };

  const getUploadIds = () => {
    if (analysisType === 'batch') {
      return uploads.map(u => u.id);
    }
    return upload ? [upload.id] : [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {getHeaderIcon()}
              {getDefaultTitle()}
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
              {analysisType === 'batch' ? 'Batch Analysis' : 'Individual Analysis'}
            </Badge>
            {analysisData.confidence_score && (
              <Badge variant="secondary">
                {Math.round(analysisData.confidence_score * 100)}% Confidence
              </Badge>
            )}
          </div>
          
          {/* Show design files being analyzed */}
          {analysisType === 'individual' && upload && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Analyzing: <span className="font-medium">{upload.file_name}</span>
              </p>
            </div>
          )}
          
          {analysisType === 'batch' && uploads.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Comparing {uploads.length} designs:
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {uploads.slice(0, 3).map((u, index) => (
                  <Badge key={u.id} variant="outline" className="text-xs">
                    {u.file_name}
                  </Badge>
                ))}
                {uploads.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{uploads.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Enhanced Impact Summary */}
      {hasImpactSummary && (
        <EnhancedImpactSummary 
          impactSummary={analysisData.impact_summary}
          winnerUploadId={analysisType === 'batch' ? analysisData.winner_upload_id : upload?.id}
          designFileName={upload?.file_name}
        />
      )}

      {/* Detailed Analysis Results */}
      <AnalysisResults
        lastAnalysisResult={analysisData.analysis_results || analysisData}
        uploadIds={getUploadIds()}
        showEnhancedSummary={false} // We're already showing it above
      />

      {/* Analysis Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisData.prompt_used && (
            <div>
              <h4 className="font-medium mb-2">Prompt Used</h4>
              <div className="bg-muted/30 p-3 rounded-lg text-sm">
                {analysisData.prompt_used}
              </div>
            </div>
          )}
          
          {analysisType === 'batch' && analysisData.context_summary && (
            <div>
              <h4 className="font-medium mb-2">Context Summary</h4>
              <div className="bg-muted/30 p-3 rounded-lg text-sm">
                {analysisData.context_summary}
              </div>
            </div>
          )}
          
          {analysisData.suggestions && (
            <div>
              <h4 className="font-medium mb-2">Suggestions</h4>
              <div className="bg-muted/30 p-3 rounded-lg text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(analysisData.suggestions, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
