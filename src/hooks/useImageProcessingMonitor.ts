
import { useState } from 'react';
import { useProcessingJobs } from './imageProcessing/useProcessingJobs';
import { useProcessingErrors } from './imageProcessing/useProcessingErrors';
import { useSystemHealth } from './imageProcessing/useSystemHealth';
import type { ProcessingJob, ImageProcessingError, SystemHealth } from './imageProcessing/types';

export const useImageProcessingMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);

  const {
    jobs,
    addJob: baseAddJob,
    updateJobProgress,
    completeJob,
    failJob: baseFailJob,
    pauseJob,
    resumeJob,
    cancelJob,
    clearCompletedJobs,
    getAverageProcessingTime,
    getActiveJobsCount
  } = useProcessingJobs();

  const {
    errors,
    createError,
    retryError,
    dismissError
  } = useProcessingErrors();

  const systemHealth = useSystemHealth(isMonitoring, getAverageProcessingTime, getActiveJobsCount);

  const addJob = (file: File): string => {
    const jobId = baseAddJob(file);
    setIsMonitoring(true);
    return jobId;
  };

  const failJob = (
    jobId: string,
    errorCode: string,
    errorMessage: string,
    stage: ImageProcessingError['processingStage']
  ) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    baseFailJob(jobId);
    createError(job, errorCode, errorMessage, stage);
  };

  return {
    jobs,
    errors,
    systemHealth,
    isMonitoring,
    addJob,
    updateJobProgress,
    completeJob,
    failJob,
    retryError,
    dismissError,
    pauseJob,
    resumeJob,
    cancelJob,
    clearCompletedJobs
  };
};

// Re-export types for convenience
export type { ProcessingJob, ImageProcessingError, SystemHealth };
