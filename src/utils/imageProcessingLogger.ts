export interface ProcessingLogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: 'validation' | 'compression' | 'upload' | 'system';
  message: string;
  metadata?: Record<string, any>;
  fileName?: string;
  duration?: number;
  memoryUsage?: number;
}

class ImageProcessingLogger {
  private logs: ProcessingLogEntry[] = [];
  private maxLogs = 1000;
  private listeners: ((logs: ProcessingLogEntry[]) => void)[] = [];

  log(
    level: ProcessingLogEntry['level'],
    category: ProcessingLogEntry['category'],
    message: string,
    metadata?: Record<string, any>,
    fileName?: string
  ) {
    const entry: ProcessingLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level,
      category,
      message,
      metadata,
      fileName,
      memoryUsage: this.getMemoryUsage()
    };

    this.logs.unshift(entry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener([...this.logs]));

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const logMethod = level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log';
      console[logMethod](`[${category.toUpperCase()}] ${message}`, metadata);
    }
  }

  info(category: ProcessingLogEntry['category'], message: string, metadata?: Record<string, any>, fileName?: string) {
    this.log('info', category, message, metadata, fileName);
  }

  warning(category: ProcessingLogEntry['category'], message: string, metadata?: Record<string, any>, fileName?: string) {
    this.log('warning', category, message, metadata, fileName);
  }

  error(category: ProcessingLogEntry['category'], message: string, metadata?: Record<string, any>, fileName?: string) {
    this.log('error', category, message, metadata, fileName);
  }

  debug(category: ProcessingLogEntry['category'], message: string, metadata?: Record<string, any>, fileName?: string) {
    this.log('debug', category, message, metadata, fileName);
  }

  // Performance tracking
  startTimer(operationId: string): () => number {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.debug('system', `Operation ${operationId} completed`, { duration });
      return duration;
    };
  }

  // Memory monitoring
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
    }
    return undefined;
  }

  // Log filtering and querying
  getLogsByLevel(level: ProcessingLogEntry['level']): ProcessingLogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  getLogsByCategory(category: ProcessingLogEntry['category']): ProcessingLogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  getLogsByFileName(fileName: string): ProcessingLogEntry[] {
    return this.logs.filter(log => log.fileName === fileName);
  }

  getRecentLogs(minutes: number = 5): ProcessingLogEntry[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.logs.filter(log => log.timestamp > cutoff);
  }

  // Analytics
  getErrorRate(timeWindowMinutes: number = 30): number {
    const recentLogs = this.getRecentLogs(timeWindowMinutes);
    if (recentLogs.length === 0) return 0;
    
    const errorCount = recentLogs.filter(log => log.level === 'error').length;
    return (errorCount / recentLogs.length) * 100;
  }

  getAverageProcessingTime(category: ProcessingLogEntry['category']): number {
    const categoryLogs = this.getLogsByCategory(category)
      .filter(log => log.duration !== undefined);
    
    if (categoryLogs.length === 0) return 0;
    
    const totalTime = categoryLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    return totalTime / categoryLogs.length;
  }

  // Subscription for real-time updates
  subscribe(callback: (logs: ProcessingLogEntry[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Export logs for analysis
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'category', 'message', 'fileName', 'duration', 'memoryUsage'];
      const csvRows = [
        headers.join(','),
        ...this.logs.map(log => [
          log.timestamp.toISOString(),
          log.level,
          log.category,
          `"${log.message.replace(/"/g, '""')}"`,
          log.fileName || '',
          log.duration || '',
          log.memoryUsage || ''
        ].join(','))
      ];
      return csvRows.join('\n');
    }
    
    return JSON.stringify(this.logs, null, 2);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.listeners.forEach(listener => listener([]));
  }
}

// Global logger instance
export const imageProcessingLogger = new ImageProcessingLogger();

// Convenience functions
export const logImageProcessing = {
  validation: {
    start: (fileName: string) => imageProcessingLogger.info('validation', 'Starting validation', {}, fileName),
    success: (fileName: string, metadata?: Record<string, any>) => 
      imageProcessingLogger.info('validation', 'Validation successful', metadata, fileName),
    error: (fileName: string, error: string, metadata?: Record<string, any>) => 
      imageProcessingLogger.error('validation', `Validation failed: ${error}`, metadata, fileName)
  },
  compression: {
    start: (fileName: string, originalSize: number) => 
      imageProcessingLogger.info('compression', 'Starting compression', { originalSize }, fileName),
    progress: (fileName: string, progress: number) => 
      imageProcessingLogger.debug('compression', `Compression progress: ${progress}%`, { progress }, fileName),
    success: (fileName: string, compressionRatio: number, finalSize: number, duration: number) => 
      imageProcessingLogger.info('compression', 'Compression successful', 
        { compressionRatio, finalSize, duration }, fileName),
    error: (fileName: string, error: string, metadata?: Record<string, any>) => 
      imageProcessingLogger.error('compression', `Compression failed: ${error}`, metadata, fileName)
  },
  upload: {
    start: (fileName: string, fileSize: number) => 
      imageProcessingLogger.info('upload', 'Starting upload', { fileSize }, fileName),
    progress: (fileName: string, progress: number, speed?: number) => 
      imageProcessingLogger.debug('upload', `Upload progress: ${progress}%`, { progress, speed }, fileName),
    success: (fileName: string, duration: number, uploadPath: string) => 
      imageProcessingLogger.info('upload', 'Upload successful', { duration, uploadPath }, fileName),
    error: (fileName: string, error: string, metadata?: Record<string, any>) => 
      imageProcessingLogger.error('upload', `Upload failed: ${error}`, metadata, fileName)
  },
  system: {
    memoryWarning: (usage: number) => 
      imageProcessingLogger.warning('system', `High memory usage detected: ${usage}%`, { usage }),
    queueOverflow: (queueSize: number) => 
      imageProcessingLogger.warning('system', `Processing queue is getting large: ${queueSize} items`, { queueSize }),
    performanceIssue: (operation: string, duration: number) => 
      imageProcessingLogger.warning('system', `Slow operation detected: ${operation}`, { operation, duration })
  }
};
