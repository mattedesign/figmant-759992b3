
import { useEffect, useState, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseSimplifiedRealTimeConnectionProps {
  onError?: (error: Error) => void;
}

export const useSimplifiedRealTimeConnection = ({ onError }: UseSimplifiedRealTimeConnectionProps = {}) => {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'fallback' | 'disabled'>('connecting');
  const [isEnabled, setIsEnabled] = useState(true);
  
  const channelRef = useRef<any>(null);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCleaningUpRef = useRef(false);
  
  const CONNECTION_TIMEOUT = 5000; // Reduced to 5 seconds
  const FALLBACK_POLL_INTERVAL = 30000; // 30 seconds

  const startFallbackPolling = useCallback(() => {
    console.log('Starting fallback polling for real-time updates...');
    setConnectionStatus('fallback');
    
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
    }
    
    fallbackIntervalRef.current = setInterval(() => {
      if (!isCleaningUpRef.current) {
        console.log('Fallback polling: Refreshing analysis data...');
        queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
        queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
        queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      }
    }, FALLBACK_POLL_INTERVAL);
  }, [queryClient]);

  const cleanupConnection = useCallback(() => {
    console.log('Cleaning up real-time connection...');
    isCleaningUpRef.current = true;

    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
    
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
        console.log('Real-time channel removed successfully');
      } catch (err) {
        console.error('Error removing real-time channel:', err);
      }
      channelRef.current = null;
    }
  }, []);

  const setupConnection = useCallback(() => {
    if (isCleaningUpRef.current || !isEnabled) {
      return;
    }

    console.log('Setting up simplified real-time connection...');
    setConnectionStatus('connecting');
    
    // Set connection timeout
    connectionTimeoutRef.current = setTimeout(() => {
      console.warn('Real-time connection timed out, falling back to polling');
      setConnectionStatus('error');
      startFallbackPolling();
      onError?.(new Error('Real-time connection timed out'));
    }, CONNECTION_TIMEOUT);

    try {
      // Clean up any existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Create a simple channel with minimal configuration
      const channelName = `analysis-updates-${Date.now()}`;
      channelRef.current = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'design_analysis'
          },
          (payload) => {
            console.log('Real-time update received for design_analysis:', payload);
            if (!isCleaningUpRef.current) {
              queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'design_uploads'
          },
          (payload) => {
            console.log('Real-time update received for design_uploads:', payload);
            if (!isCleaningUpRef.current) {
              queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'design_batch_analysis'
          },
          (payload) => {
            console.log('Real-time update received for design_batch_analysis:', payload);
            if (!isCleaningUpRef.current) {
              queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
            }
          }
        )
        .subscribe((status, err) => {
          console.log('Real-time subscription status:', status, err);
          
          if (isCleaningUpRef.current) {
            return;
          }
          
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }
          
          switch (status) {
            case 'SUBSCRIBED':
              console.log('Real-time connection established successfully');
              setConnectionStatus('connected');
              // Clear any existing fallback polling since we're connected
              if (fallbackIntervalRef.current) {
                clearInterval(fallbackIntervalRef.current);
                fallbackIntervalRef.current = null;
              }
              break;
            case 'CHANNEL_ERROR':
            case 'TIMED_OUT':
            case 'CLOSED':
              console.warn('Real-time connection failed with status:', status);
              setConnectionStatus('error');
              startFallbackPolling();
              onError?.(new Error(`Real-time connection failed: ${status}`));
              break;
          }
        });
        
    } catch (err) {
      console.error('Failed to set up real-time connection:', err);
      setConnectionStatus('error');
      startFallbackPolling();
      onError?.(err as Error);
    }
  }, [queryClient, startFallbackPolling, onError, isEnabled]);

  const toggleConnection = useCallback(() => {
    if (isEnabled) {
      console.log('Disabling real-time connection...');
      setIsEnabled(false);
      setConnectionStatus('disabled');
      cleanupConnection();
      startFallbackPolling();
    } else {
      console.log('Enabling real-time connection...');
      setIsEnabled(true);
      isCleaningUpRef.current = false;
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
        fallbackIntervalRef.current = null;
      }
      setupConnection();
    }
  }, [isEnabled, cleanupConnection, startFallbackPolling, setupConnection]);

  const retryConnection = useCallback(() => {
    if (!isEnabled) {
      return;
    }
    
    console.log('Retrying real-time connection...');
    cleanupConnection();
    isCleaningUpRef.current = false;
    setTimeout(setupConnection, 1000); // Small delay before retry
  }, [cleanupConnection, setupConnection, isEnabled]);

  useEffect(() => {
    if (isEnabled) {
      isCleaningUpRef.current = false;
      setupConnection();
    }

    return () => {
      cleanupConnection();
    };
  }, [setupConnection, cleanupConnection, isEnabled]);

  return { 
    connectionStatus, 
    isEnabled,
    toggleConnection,
    retryConnection
  };
};
