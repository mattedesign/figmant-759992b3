
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProcessingJob {
  id: string;
  fileName: string;
  fileSize: number;
  stage: 'queued' | 'validating' | 'compressing' | 'uploading' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  estimatedCompletion?: Date;
  speed?: number;
  qualityMetrics?: {
    compressionRatio: number;
    processingTime: number;
    finalSize: number;
  };
}

interface ImageProcessingError {
  id: string;
  fileName: string;
  fileSize: number;
  errorCode: string;
  errorMessage: string;
  timestamp: Date;
  processingStage: 'validation' | 'compression' | 'upload' | 'storage';
  retryCount: number;
  deviceInfo?: {
    userAgent: string;
    memoryInfo?: any;
  };
}

interface SystemHealth {
  memoryUsage: number;
  processingQueue: number;
  averageProcessingTime: number;
}

export const useImageProcessingMonitor = () => {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [errors, setErrors] = useState<ImageProcessingError[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    memoryUsage: 0,
    processingQueue: 0,
    averageProcessingTime: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const processingTimes = useRef<number[]>([]);
  const { toast } = useToast();

  // Monitor system health
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Monitor memory usage if available
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const memoryUsage = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
        
        setSystemHealth(prev => ({
          ...prev,
          memoryUsage: Math.min(memoryUsage, 100),
          processingQueue: jobs.filter(job => !['completed', 'failed'].includes(job.stage)).length,
          averageProcessingTime: processingTimes.current.length > 0 
            ? processingTimes.current.reduce((a, b) => a + b, 0) / processingTimes.current.length
            : 0
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, jobs]);

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
    setIsMonitoring(true);
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

  const failJob = (jobId: string, errorCode: string, errorMessage: string, stage: ImageProcessingError['processingStage']) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    // Update job status
    setJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, stage: 'failed' as const } : j
    ));

    // Create error record
    const error: ImageProcessingError = {
      id: crypto.randomUUID(),
      fileName: job.fileName,
      fileSize: job.fileSize,
      errorCode,
      errorMessage,
      timestamp: new Date(),
      processingStage: stage,
      retryCount: 0,
      deviceInfo: {
        userAgent: navigator.userAgent,
        memoryInfo: 'memory' in performance ? (performance as any).memory : undefined
      }
    };

    setErrors(prev => [...prev, error]);

    toast({
      variant: "destructive",
      title: "Processing Failed",
      description: errorMessage,
    });
  };

  const retryError = async (errorId: string, retryFunction: () => Promise<void>) => {
    const error = errors.find(e => e.id === errorId);
    if (!error || error.retryCount >= 3) return;

    // Update retry count
    setErrors(prev => prev.map(e => 
      e.id === errorId ? { ...e, retryCount: e.retryCount + 1 } : e
    ));

    try {
      await retryFunction();
      // Remove error if retry was successful
      setErrors(prev => prev.filter(e => e.id !== errorId));
    } catch (retryError) {
      console.error('Retry failed:', retryError);
    }
  };

  const dismissError = (errorId: string) => {
    setErrors(prev => prev.filter(e => e.id !== errorId));
  };

  const pauseJob = (jobId: string) => {
    // Implementation would depend on the specific processing pipeline
    console.log('Pausing job:', jobId);
  };

  const resumeJob = (jobId: string) => {
    // Implementation would depend on the specific processing pipeline
    console.log('Resuming job:', jobId);
  };

  const cancelJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const clearCompletedJobs = () => {
    setJobs(prev => prev.filter(job => !['completed', 'failed'].includes(job.stage)));
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
