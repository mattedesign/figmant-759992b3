
import { useCallback, useRef, useEffect } from 'react';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface PerformanceReport {
  metrics: PerformanceMetric[];
  averageDuration: number;
  slowestOperation: PerformanceMetric | null;
  fastestOperation: PerformanceMetric | null;
  totalOperations: number;
}

export const usePerformanceMonitor = () => {
  const metricsRef = useRef<PerformanceMetric[]>([]);
  const activeMetricsRef = useRef<Map<string, PerformanceMetric>>(new Map());

  const startTiming = useCallback((name: string, metadata?: Record<string, any>): string => {
    const id = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    };
    
    activeMetricsRef.current.set(id, metric);
    return id;
  }, []);

  const endTiming = useCallback((id: string): number | null => {
    const metric = activeMetricsRef.current.get(id);
    if (!metric) {
      console.warn(`Performance metric with id ${id} not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration
    };

    metricsRef.current.push(completedMetric);
    activeMetricsRef.current.delete(id);

    // Log slow operations
    if (duration > 1000) { // More than 1 second
      console.warn(`Slow operation detected: ${metric.name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }, []);

  const measureAsync = useCallback(async <T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> => {
    const id = startTiming(name, metadata);
    try {
      const result = await operation();
      endTiming(id);
      return result;
    } catch (error) {
      endTiming(id);
      throw error;
    }
  }, [startTiming, endTiming]);

  const measureSync = useCallback(<T>(
    name: string,
    operation: () => T,
    metadata?: Record<string, any>
  ): T => {
    const id = startTiming(name, metadata);
    try {
      const result = operation();
      endTiming(id);
      return result;
    } catch (error) {
      endTiming(id);
      throw error;
    }
  }, [startTiming, endTiming]);

  const getReport = useCallback((): PerformanceReport => {
    const metrics = [...metricsRef.current];
    const validMetrics = metrics.filter(m => m.duration !== undefined);
    
    if (validMetrics.length === 0) {
      return {
        metrics: [],
        averageDuration: 0,
        slowestOperation: null,
        fastestOperation: null,
        totalOperations: 0
      };
    }

    const durations = validMetrics.map(m => m.duration!);
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    const slowestOperation = validMetrics.reduce((slowest, current) => 
      current.duration! > slowest.duration! ? current : slowest
    );
    
    const fastestOperation = validMetrics.reduce((fastest, current) => 
      current.duration! < fastest.duration! ? current : fastest
    );

    return {
      metrics: validMetrics,
      averageDuration,
      slowestOperation,
      fastestOperation,
      totalOperations: validMetrics.length
    };
  }, []);

  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
    activeMetricsRef.current.clear();
  }, []);

  // Log performance report periodically in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const report = getReport();
        if (report.totalOperations > 0) {
          console.log('Performance Report:', report);
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [getReport]);

  return {
    startTiming,
    endTiming,
    measureAsync,
    measureSync,
    getReport,
    clearMetrics
  };
};
