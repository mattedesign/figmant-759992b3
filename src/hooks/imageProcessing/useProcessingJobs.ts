
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProcessingJob } from './types';

export const useProcessingJobs = () => {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const processingTimes = useRef<number[]>([]);
  const { toast } = useToast();

  const addJob = (file: File): string => {
    const jobId = crypto.randomUUID();
    const newJob: ProcessingJob = {
      id: jobId,
      fileName: file.name,
      fileSize: file.size,
      stage: 'queued',
      progress: 0,
      startTime: new Date()
    };

    setJobs(prev => [...prev, newJob]);
    return jobId;
  };

  const updateJobProgress = (jobId: string, stage: ProcessingJob['stage'], progress: number, speed?: number) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            stage, 
            progress,
            speed,
            estimatedCompletion: speed && progress < 100 
              ? new Date(Date.now() + ((job.fileSize * (1 - progress / 100)) / speed) * 1000)
              : undefined
          }
        : job
    ));
  };

  const completeJob = (jobId: string, qualityMetrics?: ProcessingJob['qualityMetrics']) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const processingTime = (Date.now() - job.startTime.getTime()) / 1000;
        
        // Track processing times for average calculation
        processingTimes.current.push(processingTime);
        if (processingTimes.current.length > 50) {
          processingTimes.current.shift(); // Keep only last 50 for moving average
        }

        return {
          ...job,
          stage: 'completed' as const,
          progress: 100,
          qualityMetrics: qualityMetrics || {
            compressionRatio: 0,
            processingTime,
            finalSize: job.fileSize
          }
        };
      }
      return job;
    }));

    toast({
      title: "Processing Complete",
      description: `Successfully processed image`,
    });
  };

  const failJob = (jobId: string) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, stage: 'failed' as const } : j
    ));
  };

  const pauseJob = (jobId: string) => {
    console.log('Pausing job:', jobId);
  };

  const resumeJob = (jobId: string) => {
    console.log('Resuming job:', jobId);
  };

  const cancelJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const clearCompletedJobs = () => {
    setJobs(prev => prev.filter(job => !['completed', 'failed'].includes(job.stage)));
  };

  const getAverageProcessingTime = () => {
    return processingTimes.current.length > 0 
      ? processingTimes.current.reduce((a, b) => a + b, 0) / processingTimes.current.length
      : 0;
  };

  const getActiveJobsCount = () => {
    return jobs.filter(job => !['completed', 'failed'].includes(job.stage)).length;
  };

  return {
    jobs,
    addJob,
    updateJobProgress,
    completeJob,
    failJob,
    pauseJob,
    resumeJob,
    cancelJob,
    clearCompletedJobs,
    getAverageProcessingTime,
    getActiveJobsCount
  };
};
