
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageProcessingError, ProcessingJob } from './types';

export const useProcessingErrors = () => {
  const [errors, setErrors] = useState<ImageProcessingError[]>([]);
  const { toast } = useToast();

  const createError = (
    job: ProcessingJob,
    errorCode: string,
    errorMessage: string,
    stage: ImageProcessingError['processingStage']
  ) => {
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

    return error;
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

  return {
    errors,
    createError,
    retryError,
    dismissError
  };
};
