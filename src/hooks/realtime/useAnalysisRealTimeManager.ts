
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeConnection } from './useRealtimeConnection';
import { useFallbackPolling } from './useFallbackPolling';

interface UseAnalysisRealTimeManagerProps {
  onError: (error: Error) => void;
}

export const useAnalysisRealTimeManager = ({ onError }: UseAnalysisRealTimeManagerProps) => {
  const { toast } = useToast();
  const { startFallbackPolling, stopFallbackPolling } = useFallbackPolling();
  
  const { connectionStatus, setupConnection, cleanupConnection } = useRealtimeConnection({
    onError,
    onToast: (title, description) => {
      toast({ title, description });
    }
  });

  useEffect(() => {
    console.log('Initializing enhanced real-time subscriptions...');
    setupConnection();

    return () => {
      console.log('Real-time subscriptions effect cleanup triggered');
      stopFallbackPolling();
      cleanupConnection();
    };
  }, [setupConnection, cleanupConnection, stopFallbackPolling]);

  useEffect(() => {
    if (connectionStatus === 'fallback') {
      startFallbackPolling();
    } else if (connectionStatus === 'connected') {
      stopFallbackPolling();
    }
  }, [connectionStatus, startFallbackPolling, stopFallbackPolling]);

  return { connectionStatus };
};
