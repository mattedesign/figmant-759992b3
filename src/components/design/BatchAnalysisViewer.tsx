
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Users, BarChart3, Target } from 'lucide-react';
import { DesignBatchAnalysis, DesignUpload } from '@/types/design';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { formatDistanceToNow } from 'date-fns';

interface BatchAnalysisViewerProps {
  batchAnalysis: DesignBatchAnalysis;
  onBack: () => void;
}

export const BatchAnalysisViewer = ({ batchAnalysis, onBack }: BatchAnalysisViewerProps) => {
  const { data: allUploads = [] } = useDesignUploads();
  
  const batchUploads = allUploads.filter(upload => upload.batch_id === batchAnalysis.batch_id);
  const analysisResults = batchAnalysis.analysis_results?.response || 'No analysis results available.';

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="text-sm text-muted-foreground">
          Dashboard → Batch Analysis
        </div>
      </div>

      {/* Batch Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Batch Comparative Analysis
              </CardTitle>
              <CardDescription>
                Analysis of {batchUploads.length} designs • {formatDistanceToNow(new Date(batchAnalysis.created_at))} ago
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              {batchAnalysis.analysis_type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Designs Analyzed</p>
                <p className="text-2xl font-bold">{batchUploads.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Confidence Score</p>
                <p className="text-2xl font-bold">{Math.round(batchAnalysis.confidence_score * 100)}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm font-medium">{new Date(batchAnalysis.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {batchAnalysis.context_summary && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm font-medium text-blue-800 mb-1">Context Enhanced Analysis</p>
              <p className="text-sm text-blue-700">{batchAnalysis.context_summary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Analyzed Designs</CardTitle>
          <CardDescription>Individual designs included in this batch analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {batchUploads.map((upload, index) => (
              <div key={upload.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{upload.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {upload.source_type === 'file' ? 'File Upload' : 'URL Analysis'}
                  </p>
                </div>
                <Badge variant={upload.status === 'completed' ? 'default' : 'secondary'}>
                  {upload.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle>Comparative Analysis Results</CardTitle>
          <CardDescription>
            AI-powered insights comparing all designs in this batch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
              {analysisResults}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Settings */}
      {batchAnalysis.analysis_settings && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Configuration</CardTitle>
            <CardDescription>Settings used for this batch analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Uploads Count</p>
                <p>{batchAnalysis.analysis_settings.uploads_count}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Context Files</p>
                <p>{batchAnalysis.analysis_settings.context_files_count || 0}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Analysis Depth</p>
                <p className="capitalize">{batchAnalysis.analysis_settings.analysis_depth || 'detailed'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
