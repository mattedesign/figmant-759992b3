
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye, FileText, CheckCircle } from 'lucide-react';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';

interface AnalysisResultsProps {
  onViewUpload?: (upload: DesignUpload) => void;
  onViewBatchAnalysis?: (batch: DesignBatchAnalysis) => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  onViewUpload, 
  onViewBatchAnalysis 
}) => {
  const { data: uploads } = useDesignUploads();
  const { data: batchAnalyses } = useDesignBatchAnalyses();

  // Show recent uploads and batch analyses
  const recentUploads = uploads?.slice(0, 3) || [];
  const recentBatches = batchAnalyses?.slice(0, 3) || [];

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg">Recent Analyses</CardTitle>
        </div>
        <CardDescription>
          Your recent design analyses and uploads.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Batch Analyses */}
        {recentBatches.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recent Batch Analyses:</h4>
            {recentBatches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">Batch Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    {batch.analysis_type} • Created {new Date(batch.created_at).toLocaleDateString()}
                  </p>
                </div>
                {onViewBatchAnalysis && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewBatchAnalysis(batch)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Analysis
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Recent Individual Uploads */}
        {recentUploads.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recent Individual Analyses:</h4>
            {recentUploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm truncate">{upload.file_name}</span>
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

        {/* Empty State */}
        {recentUploads.length === 0 && recentBatches.length === 0 && (
          <div className="p-3 bg-background border rounded-lg">
            <p className="text-sm text-muted-foreground">
              No recent analyses found. Upload files or share URLs to get started with design analysis.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
