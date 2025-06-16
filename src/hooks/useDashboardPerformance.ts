
import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface PerformanceMetrics {
  renderTime: number;
  dataProcessingTime: number;
  lastUpdateTime: Date;
  cacheHitRate: number;
}

export const useDashboardPerformance = () => {
  const queryClient = useQueryClient();
  const renderStartTime = useRef<number>(0);
  const processingStartTime = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics>({
    renderTime: 0,
    dataProcessingTime: 0,
    lastUpdateTime: new Date(),
    cacheHitRate: 0
  });

  // Start performance measurement
  const startRenderMeasurement = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderMeasurement = useCallback(() => {
    if (renderStartTime.current > 0) {
      metrics.current.renderTime = performance.now() - renderStartTime.current;
    }
  }, []);

  const startProcessingMeasurement = useCallback(() => {
    processingStartTime.current = performance.now();
  }, []);

  const endProcessingMeasurement = useCallback(() => {
    if (processingStartTime.current > 0) {
      metrics.current.dataProcessingTime = performance.now() - processingStartTime.current;
      metrics.current.lastUpdateTime = new Date();
    }
  }, []);

  // Cache optimization
  const optimizeQueryCache = useCallback(() => {
    // Remove old cached data that's not being used
    queryClient.getQueryCache().getAll().forEach(query => {
      const isStale = Date.now() - (query.state.dataUpdatedAt || 0) > 300000; // 5 minutes
      const isUnused = !query.getObserversCount();
      
      if (isStale && isUnused) {
        queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });
  }, [queryClient]);

  // Memory cleanup
  const cleanupMemory = useCallback(() => {
    if ('gc' in window && typeof window.gc === 'function') {
      window.gc();
    }
  }, []);

  // Calculate cache hit rate
  const calculateCacheHitRate = useCallback(() => {
    const queries = queryClient.getQueryCache().getAll();
    const hitQueries = queries.filter(query => 
      query.state.status === 'success' && !query.state.isFetching
    );
    
    metrics.current.cacheHitRate = queries.length > 0 
      ? (hitQueries.length / queries.length) * 100 
      : 0;
  }, [queryClient]);

  // Performance monitoring effect
  useEffect(() => {
    const interval = setInterval(() => {
      calculateCacheHitRate();
      optimizeQueryCache();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [calculateCacheHitRate, optimizeQueryCache]);

  return {
    metrics: metrics.current,
    startRenderMeasurement,
    endRenderMeasurement,
    startProcessingMeasurement,
    endProcessingMeasurement,
    optimizeQueryCache,
    cleanupMemory
  };
};
