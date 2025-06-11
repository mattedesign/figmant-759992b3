
import React, { useState } from 'react';
import { ProcessingJob } from '@/hooks/imageProcessing/types';
import { SystemHealthCard } from './processing/SystemHealthCard';
import { ActiveJobsCard } from './processing/ActiveJobsCard';
import { CompletedJobsCard } from './processing/CompletedJobsCard';
import { formatFileSize, formatTime, getEstimatedTimeRemaining } from './processing/utils';

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

  const activeJobs = jobs.filter(job => !['completed', 'failed'].includes(job.stage));
  const completedJobs = jobs.filter(job => ['completed', 'failed'].includes(job.stage));

  return (
    <div className="space-y-4">
      <SystemHealthCard 
        systemHealth={systemHealth} 
        formatTime={formatTime}
      />

      <ActiveJobsCard
        activeJobs={activeJobs}
        onPauseJob={onPauseJob}
        formatFileSize={formatFileSize}
        formatTime={formatTime}
        getEstimatedTimeRemaining={getEstimatedTimeRemaining}
      />

      <CompletedJobsCard
        completedJobs={completedJobs}
        formatTime={formatTime}
      />
    </div>
  );
};
