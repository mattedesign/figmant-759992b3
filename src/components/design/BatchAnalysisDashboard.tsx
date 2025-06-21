
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Calendar, Users, ArrowRight } from 'lucide-react';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { EnhancedBatchAnalysisViewer } from './EnhancedBatchAnalysisViewer';
import { DesignBatchAnalysis } from '@/types/design';
import { formatDistanceToNow } from 'date-fns';

export const BatchAnalysisDashboard = () => {
  const [selectedBatch, setSelectedBatch] = useState<DesignBatchAnalysis | null>(null);
  const { data: batchAnalyses = [] } = useDesignBatchAnalyses();
  const { data: uploads = [] } = useDesignUploads();

  if (selectedBatch) {
    return (
      <EnhancedBatchAnalysisViewer
        batchAnalysis={selectedBatch}
        onBack={() => setSelectedBatch(null)}
      />
    );
  }

  const getBatchUploadCount = (batchId: string) => {
    return uploads.filter(upload => upload.batch_id === batchId).length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Batch Analysis Dashboard</h2>
        <p className="text-muted-foreground">
          View and manage your comparative design analyses
        </p>
      </div>

      {batchAnalyses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Batch Analyses Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Upload multiple designs to create your first batch analysis
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {batchAnalyses.map((analysis) => (
            <Card key={analysis.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Batch Analysis
                      {analysis.version_number && analysis.version_number > 1 && (
                        <Badge variant="outline">v{analysis.version_number}</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {analysis.analysis_type} • {formatDistanceToNow(new Date(analysis.created_at))} ago
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    {Math.round(analysis.confidence_score * 100)}% confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{getBatchUploadCount(analysis.batch_id)} designs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(analysis.created_at))} ago</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBatch(analysis)}
                    className="flex items-center gap-2"
                  >
                    View Analysis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {analysis.context_summary && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-blue-700">{analysis.context_summary}</p>
                  </div>
                )}
                
                {analysis.modification_summary && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                    <p className="text-sm font-medium text-amber-800 mb-1">Modified Analysis</p>
                    <p className="text-sm text-amber-700">{analysis.modification_summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
