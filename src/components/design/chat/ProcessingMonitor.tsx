
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Clock, Zap, AlertCircle, CheckCircle, Pause, Play } from 'lucide-react';

interface ProcessingJob {
  id: string;
  fileName: string;
  fileSize: number;
  stage: 'queued' | 'validating' | 'compressing' | 'uploading' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  estimatedCompletion?: Date;
  speed?: number; // bytes per second
  qualityMetrics?: {
    compressionRatio: number;
    processingTime: number;
    finalSize: number;
  };
}

interface ProcessingMonitorProps {
  jobs: ProcessingJob[];
  onPauseJob: (jobId: string) => void;
  onResumeJob: (jobId: string) => void;
  onCancelJob: (jobId: string) => void;
  systemHealth: {
    memoryUsage: number;
    processingQueue: number;
    averageProcessingTime: number;
  };
}

export const ProcessingMonitor: React.FC<ProcessingMonitorProps> = ({
  jobs,
  onPauseJob,
  onResumeJob,
  onCancelJob,
  systemHealth
}) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(0)}s`;
  };

  const getEstimatedTimeRemaining = (job: ProcessingJob) => {
    if (!job.speed || job.progress === 0) return 'Calculating...';
    const remainingBytes = job.fileSize * (1 - job.progress / 100);
    const remainingSeconds = remainingBytes / job.speed;
    return formatTime(remainingSeconds);
  };

  const activeJobs = jobs.filter(job => !['completed', 'failed'].includes(job.stage));
  const completedJobs = jobs.filter(job => ['completed', 'failed'].includes(job.stage));

  return (
    <div className="space-y-4">
      {/* System Health Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Memory Usage</p>
              <div className="flex items-center gap-2">
                <Progress value={systemHealth.memoryUsage} className="flex-1 h-2" />
                <span className="text-xs font-mono">{systemHealth.memoryUsage}%</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Queue Length</p>
              <p className="font-semibold">{systemHealth.processingQueue} items</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Processing Time</p>
              <p className="font-semibold">{formatTime(systemHealth.averageProcessingTime)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Active Processing ({activeJobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeJobs.map(job => (
              <div key={job.id} className="space-y-2 p-3 border rounded-lg">
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
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Jobs Summary */}
      {completedJobs.length > 0 && (
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
      )}
    </div>
  );
};
