
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, Zap, AlertCircle, CheckCircle, Pause } from 'lucide-react';
import { ProcessingJob } from '@/hooks/imageProcessing/types';

interface JobProgressItemProps {
  job: ProcessingJob;
  onPauseJob: (jobId: string) => void;
  formatFileSize: (bytes: number) => string;
  formatTime: (seconds: number) => string;
  getEstimatedTimeRemaining: (job: ProcessingJob) => string;
}

export const JobProgressItem: React.FC<JobProgressItemProps> = ({
  job,
  onPauseJob,
  formatFileSize,
  formatTime,
  getEstimatedTimeRemaining
}) => {
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

  const getStageColor = (stage: ProcessingJob['stage']) => {
    switch (stage) {
      case 'queued': return 'bg-gray-100 text-gray-800';
      case 'validating': return 'bg-blue-100 text-blue-800';
      case 'compressing': return 'bg-yellow-100 text-yellow-800';
      case 'uploading': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-2 p-3 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStageIcon(job.stage)}
          <span className="font-medium text-sm">{job.fileName}</span>
          <Badge className={getStageColor(job.stage)}>
            {job.stage}
          </Badge>
        </div>
        <div className="flex gap-1">
          {job.stage !== 'queued' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onPauseJob(job.id)}
            >
              <Pause className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatFileSize(job.fileSize)}</span>
          <span>ETA: {getEstimatedTimeRemaining(job)}</span>
        </div>
        <Progress value={job.progress} className="h-2" />
        <div className="text-xs text-muted-foreground">
          {job.progress.toFixed(1)}% complete
        </div>
      </div>
    </div>
  );
};
