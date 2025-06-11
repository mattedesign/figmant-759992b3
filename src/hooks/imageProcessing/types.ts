
export interface ProcessingJob {
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

export interface ImageProcessingError {
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

export interface SystemHealth {
  memoryUsage: number;
  processingQueue: number;
  averageProcessingTime: number;
}
