
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcessingJob } from '@/hooks/imageProcessing/types';
import { JobProgressItem } from './JobProgressItem';

interface ActiveJobsCardProps {
  activeJobs: ProcessingJob[];
  onPauseJob: (jobId: string) => void;
  formatFileSize: (bytes: number) => string;
  formatTime: (seconds: number) => string;
  getEstimatedTimeRemaining: (job: ProcessingJob) => string;
}

export const ActiveJobsCard: React.FC<ActiveJobsCardProps> = ({
  activeJobs,
  onPauseJob,
  formatFileSize,
  formatTime,
  getEstimatedTimeRemaining
}) => {
  if (activeJobs.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          Active Processing ({activeJobs.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeJobs.map(job => (
          <JobProgressItem
            key={job.id}
            job={job}
            onPauseJob={onPauseJob}
            formatFileSize={formatFileSize}
            formatTime={formatTime}
            getEstimatedTimeRemaining={getEstimatedTimeRemaining}
          />
        ))}
      </CardContent>
    </Card>
  );
};
