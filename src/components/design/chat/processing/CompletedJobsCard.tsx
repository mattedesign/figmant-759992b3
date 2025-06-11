
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { ProcessingJob } from '@/hooks/imageProcessing/types';

interface CompletedJobsCardProps {
  completedJobs: ProcessingJob[];
  formatTime: (seconds: number) => string;
}

export const CompletedJobsCard: React.FC<CompletedJobsCardProps> = ({
  completedJobs,
  formatTime
}) => {
  if (completedJobs.length === 0) return null;

  const getStageIcon = (stage: ProcessingJob['stage']) => {
    switch (stage) {
      case 'queued': return <Clock className="h-3 w-3" />;
      case 'validating': return <AlertCircle className="h-3 w-3 animate-pulse" />;
      case 'compressing': return <Zap className="h-3 w-3 animate-spin" />;
      case 'uploading': return <Activity className="h-3 w-3 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'failed': return <AlertCircle className="h-3 w-3 text-red-600" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          Recent Completions ({completedJobs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {completedJobs.slice(0, 3).map(job => (
            <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-2">
                {getStageIcon(job.stage)}
                <span className="text-sm">{job.fileName}</span>
                {job.qualityMetrics && (
                  <Badge variant="outline" className="text-xs">
                    {job.qualityMetrics.compressionRatio}% compressed
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {job.qualityMetrics && formatTime(job.qualityMetrics.processingTime)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
