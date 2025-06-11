
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye, FileText, CheckCircle } from 'lucide-react';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';

interface AnalysisResultsProps {
  result: {
    analysis: string;
    uploadIds: string[];
    batchId?: string;
  };
  onViewUpload?: (upload: DesignUpload) => void;
  onViewBatchAnalysis?: (batch: DesignBatchAnalysis) => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  result, 
  onViewUpload, 
  onViewBatchAnalysis 
}) => {
  const { data: uploads } = useDesignUploads();
  const { data: batchAnalyses } = useDesignBatchAnalyses();

  const relatedUploads = uploads?.filter(upload => 
    result.uploadIds.includes(upload.id)
  ) || [];

  const relatedBatch = result.batchId ? 
    batchAnalyses?.find(batch => batch.id === result.batchId) : 
    null;

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg">Analysis Complete</CardTitle>
        </div>
        <CardDescription>
          Your design analysis has been processed and is ready for review.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Batch Analysis Link */}
        {relatedBatch && onViewBatchAnalysis && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">{relatedBatch.batch_name}</h4>
              <p className="text-sm text-muted-foreground">
                Batch analysis with {relatedUploads.length} items
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewBatchAnalysis(relatedBatch)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Analysis
            </Button>
          </div>
        )}

        {/* Individual Upload Links */}
        {relatedUploads.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Individual Analyses:</h4>
            {relatedUploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm truncate">{upload.original_filename}</span>
                  <Badge variant="secondary" className="text-xs">
                    {upload.use_case}
                  </Badge>
                </div>
                {onViewUpload && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewUpload(upload)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Summary */}
        <div className="p-3 bg-background border rounded-lg">
          <p className="text-sm text-muted-foreground">
            {result.uploadIds.length > 0 
              ? `Successfully processed ${result.uploadIds.length} design(s). Click the buttons above to view detailed analysis results.`
              : "Ready to analyze your designs. Upload files or share URLs to get started."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
