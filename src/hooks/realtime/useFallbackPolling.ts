
import { useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useFallbackPolling = () => {
  const queryClient = useQueryClient();
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const FALLBACK_POLL_INTERVAL = 30000; // 30 seconds

  const startFallbackPolling = useCallback(() => {
    console.log('Setting up fallback polling for real-time updates...');
    
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
    }
    
    fallbackIntervalRef.current = setInterval(() => {
      console.log('Fallback polling: Refreshing analysis data...');
      queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
    }, FALLBACK_POLL_INTERVAL);
  }, [queryClient]);

  const stopFallbackPolling = useCallback(() => {
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
  }, []);

  return {
    startFallbackPolling,
    stopFallbackPolling
  };
};
