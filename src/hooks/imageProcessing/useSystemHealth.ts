
import { useState, useEffect } from 'react';
import { SystemHealth } from './types';

export const useSystemHealth = (
  isMonitoring: boolean,
  getAverageProcessingTime: () => number,
  getActiveJobsCount: () => number
) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    memoryUsage: 0,
    processingQueue: 0,
    averageProcessingTime: 0
  });

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
          processingQueue: getActiveJobsCount(),
          averageProcessingTime: getAverageProcessingTime()
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, getAverageProcessingTime, getActiveJobsCount]);

  return systemHealth;
};
