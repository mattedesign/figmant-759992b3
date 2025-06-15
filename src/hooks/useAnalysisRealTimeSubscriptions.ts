
import { useEffect, useState, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseAnalysisRealTimeSubscriptionsProps {
  onError: (error: Error) => void;
}

export const useAnalysisRealTimeSubscriptions = ({ onError }: UseAnalysisRealTimeSubscriptionsProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'fallback'>('connecting');
  
  // Use refs to prevent stale closures and manage cleanup
  const channelRef = useRef<any>(null);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const isCleaningUpRef = useRef(false);
  
  const MAX_RETRIES = 3;
  const CONNECTION_TIMEOUT = 10000; // 10 seconds
  const RETRY_DELAY = 2000; // 2 seconds
  const FALLBACK_POLL_INTERVAL = 30000; // 30 seconds

  // Generate unique channel name to avoid conflicts
  const channelName = `analysis-updates-${Math.random().toString(36).substr(2, 9)}`;

  const cleanupResources = useCallback(() => {
    console.log('Cleaning up real-time subscription resources...');
    isCleaningUpRef.current = true;

    // Clear all timeouts
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // Clear fallback polling
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
    
    // Clean up channel
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
        console.log('Successfully removed real-time channel');
      } catch (err) {
        console.error('Error removing real-time channel:', err);
      }
      channelRef.current = null;
    }
  }, []);

  const setupFallbackPolling = useCallback(() => {
    console.log('Setting up fallback polling for real-time updates...');
    setConnectionStatus('fallback');
    
    // Clear any existing polling
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
    }
    
    // Poll for updates every 30 seconds as fallback
    fallbackIntervalRef.current = setInterval(() => {
      if (!isCleaningUpRef.current) {
        console.log('Fallback polling: Refreshing analysis data...');
        queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
        queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
        queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      }
    }, FALLBACK_POLL_INTERVAL);
  }, [queryClient]);

  const handleConnectionSuccess = useCallback(() => {
    console.log('Real-time connection established successfully');
    setConnectionStatus('connected');
    retryCountRef.current = 0;
    
    // Clear connection timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    
    // Clear any existing fallback polling since we're connected
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
  }, []);

  const handleConnectionError = useCallback((status: string, error?: any) => {
    console.warn('Real-time subscription failed with status:', status, 'Error:', error);
    
    if (isCleaningUpRef.current) {
      return; // Don't retry if we're cleaning up
    }
    
    setConnectionStatus('error');
    
    // Clear connection timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    
    // Implement retry logic with exponential backoff
    if (retryCountRef.current < MAX_RETRIES) {
      const retryDelay = RETRY_DELAY * Math.pow(2, retryCountRef.current);
      console.log(`Retrying real-time connection... Attempt ${retryCountRef.current + 1}/${MAX_RETRIES} in ${retryDelay}ms`);
      retryCountRef.current += 1;
      
      retryTimeoutRef.current = setTimeout(() => {
        if (!isCleaningUpRef.current) {
          setupRealtimeConnection();
        }
      }, retryDelay);
    } else {
      console.warn('Max retries reached, falling back to polling');
      setupFallbackPolling();
      onError(new Error(`Real-time updates failed after ${MAX_RETRIES} attempts. Using fallback polling.`));
    }
  }, [onError, setupFallbackPolling]);

  const setupRealtimeConnection = useCallback(() => {
    if (isCleaningUpRef.current) {
      return;
    }

    console.log('Setting up real-time subscription with channel:', channelName);
    setConnectionStatus('connecting');
    
    // Set connection timeout
    connectionTimeoutRef.current = setTimeout(() => {
      console.warn('Real-time connection timed out');
      handleConnectionError('TIMED_OUT');
    }, CONNECTION_TIMEOUT);

    try {
      // Clean up any existing channel first
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Create new channel with simplified configuration
      channelRef.current = supabase
        .channel(channelName, {
          config: {
            broadcast: { self: false },
            presence: { key: '' }
          }
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'design_analysis'
          },
          (payload) => {
            console.log('Real-time: New analysis inserted:', payload.new?.id);
            if (!isCleaningUpRef.current) {
              queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
              toast({
                title: "New Analysis Available",
                description: "A new analysis has been completed and is now visible.",
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'design_uploads'
          },
          (payload) => {
            console.log('Real-time: Upload status updated:', payload.new?.id);
            if (!isCleaningUpRef.current) {
              queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'design_batch_analysis'
          },
          (payload) => {
            console.log('Real-time: New batch analysis inserted:', payload.new?.id);
            if (!isCleaningUpRef.current) {
              queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
              toast({
                title: "New Batch Analysis Available",
                description: "A new batch analysis has been completed and is now visible.",
              });
            }
          }
        )
        .subscribe((status, err) => {
          console.log('Real-time subscription status:', status, err);
          
          if (isCleaningUpRef.current) {
            return; // Don't process status changes if we're cleaning up
          }
          
          switch (status) {
            case 'SUBSCRIBED':
              handleConnectionSuccess();
              break;
            case 'CHANNEL_ERROR':
            case 'TIMED_OUT':
            case 'CLOSED':
              handleConnectionError(status, err);
              break;
            default:
              console.log('Unhandled subscription status:', status);
          }
        });
        
    } catch (err) {
      console.error('Failed to set up real-time subscription:', err);
      handleConnectionError('SETUP_ERROR', err);
    }
  }, [channelName, queryClient, toast, handleConnectionSuccess, handleConnectionError]);

  useEffect(() => {
    console.log('Initializing enhanced real-time subscriptions...');
    isCleaningUpRef.current = false;
    retryCountRef.current = 0;
    
    // Start the initial connection
    setupRealtimeConnection();

    return () => {
      console.log('Real-time subscriptions effect cleanup triggered');
      cleanupResources();
    };
  }, [setupRealtimeConnection, cleanupResources]);

  return { connectionStatus };
};
