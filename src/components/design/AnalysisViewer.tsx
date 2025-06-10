
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Brain } from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalysis';
import { DesignUpload } from '@/types/design';
import { formatDistanceToNow } from 'date-fns';

interface AnalysisViewerProps {
  upload: DesignUpload;
  onBack: () => void;
}

export const AnalysisViewer = ({ upload, onBack }: AnalysisViewerProps) => {
  const { data: analyses = [], isLoading } = useDesignAnalyses(upload.id);

  if (isLoading) {
    return <div>Loading analysis...</div>;
  }

  const latestAnalysis = analyses[0];

  if (!latestAnalysis) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" onClick={onBack} className="w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Uploads
          </Button>
          <CardTitle>{upload.file_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No analysis available for this design.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Uploads
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {upload.file_name}
              </CardTitle>
              <CardDescription>
                Analysis Type: {latestAnalysis.analysis_type}
              </CardDescription>
            </div>
            <Badge variant="outline">
              Confidence: {Math.round(latestAnalysis.confidence_score * 100)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Generated {formatDistanceToNow(new Date(latestAnalysis.created_at))} ago
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {latestAnalysis.analysis_results?.response || 'No analysis content available.'}
            </div>
          </div>
        </CardContent>
      </Card>

      {latestAnalysis.suggestions && (
        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {JSON.stringify(latestAnalysis.suggestions, null, 2)}
            </div>
          </CardContent>
        </Card>
      )}

      {latestAnalysis.improvement_areas && latestAnalysis.improvement_areas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Improvement Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {latestAnalysis.improvement_areas.map((area, index) => (
                <Badge key={index} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
