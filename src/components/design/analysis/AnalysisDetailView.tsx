
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileImage } from 'lucide-react';
import { format } from 'date-fns';
import { UnifiedAnalysisResultsViewer } from '../UnifiedAnalysisResultsViewer';

interface Analysis {
  id: string;
  type: string;
  title: string;
  status: string;
  created_at: string;
  confidence_score: number;
  analysis_type: string;
  upload_count: number;
  winner_upload_id: string | null;
  batch_name: string | null;
  rawData: any;
  relatedUpload?: any;
  relatedUploads?: any[];
}

interface AnalysisDetailViewProps {
  analysis: Analysis;
  onBack: () => void;
}

export const AnalysisDetailView = ({ analysis, onBack }: AnalysisDetailViewProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'default' as const, label: 'Completed' },
      processing: { variant: 'secondary' as const, label: 'Processing' },
      pending: { variant: 'outline' as const, label: 'Pending' },
      failed: { variant: 'destructive' as const, label: 'Failed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    return type === 'batch' ? (
      <BarChart3 className="h-4 w-4 text-blue-600" />
    ) : (
      <FileImage className="h-4 w-4 text-green-500" />
    );
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          ← Back to All Analysis
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{analysis.title}</h1>
          <p className="text-muted-foreground">
            {analysis.type === 'batch' ? 'Batch Analysis' : 'Individual Analysis'} • 
            {format(new Date(analysis.created_at), 'PPP')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getTypeIcon(analysis.type)}
            Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <p className="capitalize">{analysis.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">{getStatusBadge(analysis.status)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Confidence</label>
              <p>{Math.round((analysis.confidence_score || 0) * 100)}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Files</label>
              <p>{analysis.upload_count} file{analysis.upload_count !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {analysis.type === 'batch' && analysis.winner_upload_id && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Winner</label>
              <p className="text-green-600 font-medium">
                {analysis.relatedUploads?.find((u: any) => u.id === analysis.winner_upload_id)?.file_name || 'Unknown'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Use UnifiedAnalysisResultsViewer for formatted display */}
      <UnifiedAnalysisResultsViewer
        analysisData={analysis.rawData}
        analysisType={analysis.type === 'batch' ? 'batch' : 'individual'}
        upload={analysis.relatedUpload}
        uploads={analysis.relatedUploads}
        title={analysis.title}
      />
    </div>
  );
};
