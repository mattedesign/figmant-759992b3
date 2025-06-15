
import { useEffect, useState, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseSimplifiedRealTimeConnectionProps {
  onError?: (error: Error) => void;
}

export const useSimplifiedRealTimeConnection = ({ onError }: UseSimplifiedRealTimeConnectionProps = {}) => {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'fallback' | 'disabled'>('disabled');
  const [isEnabled, setIsEnabled] = useState(true);
  
  const channelRef = useRef<any>(null);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCleaningUpRef = useRef(false);
  const retryCountRef = useRef(0);
  
  const CONNECTION_TIMEOUT = 3000; // Reduced to 3 seconds for faster fallback
  const FALLBACK_POLL_INTERVAL = 30000; // 30 seconds
  const MAX_RETRIES = 2; // Reduced retries for faster fallback

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
        console.warn('Error removing real-time channel:', err);
      }
      channelRef.current = null;
    }
  }, []);

  const setupConnection = useCallback(() => {
    if (isCleaningUpRef.current || !isEnabled) {
      return;
    }

    console.log('Attempting real-time connection...');
    setConnectionStatus('connecting');
    
    // Set aggressive timeout for faster fallback
    connectionTimeoutRef.current = setTimeout(() => {
      console.log('Real-time connection timed out, switching to fallback polling');
      setConnectionStatus('fallback');
      startFallbackPolling();
      
      // Don't treat this as an error - it's expected behavior
      if (retryCountRef.current >= MAX_RETRIES) {
        console.log('Max retries reached, staying in fallback mode');
      }
    }, CONNECTION_TIMEOUT);

    try {
      // Clean up any existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Create a minimal channel configuration
      const channelName = `analysis-updates-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
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
            event: '*',
            schema: 'public',
            table: 'design_analysis'
          },
          (payload) => {
            console.log('Real-time update received for design_analysis');
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
            console.log('Real-time update received for design_uploads');
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
            console.log('Real-time update received for design_batch_analysis');
            if (!isCleaningUpRef.current) {
              queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
            }
          }
        )
        .subscribe((status, err) => {
          console.log('Real-time subscription status:', status);
          
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
              retryCountRef.current = 0;
              // Clear any existing fallback polling since we're connected
              if (fallbackIntervalRef.current) {
                clearInterval(fallbackIntervalRef.current);
                fallbackIntervalRef.current = null;
              }
              break;
            case 'CHANNEL_ERROR':
            case 'TIMED_OUT':
            case 'CLOSED':
              console.log('Real-time connection failed, switching to fallback:', status);
              setConnectionStatus('fallback');
              startFallbackPolling();
              
              // Only retry if we haven't exceeded max retries
              if (retryCountRef.current < MAX_RETRIES) {
                retryCountRef.current++;
                console.log(`Will retry connection (${retryCountRef.current}/${MAX_RETRIES}) in 5 seconds...`);
                setTimeout(() => {
                  if (!isCleaningUpRef.current && isEnabled) {
                    setupConnection();
                  }
                }, 5000);
              } else {
                console.log('Max retries reached, staying in fallback mode');
              }
              break;
          }
        });
        
    } catch (err) {
      console.warn('Failed to set up real-time connection, using fallback:', err);
      setConnectionStatus('fallback');
      startFallbackPolling();
    }
  }, [queryClient, startFallbackPolling, isEnabled]);

  const toggleConnection = useCallback(() => {
    if (isEnabled) {
      console.log('Disabling real-time connection...');
      setIsEnabled(false);
      setConnectionStatus('disabled');
      cleanupConnection();
      // Don't start fallback when manually disabled
    } else {
      console.log('Enabling real-time connection...');
      setIsEnabled(true);
      isCleaningUpRef.current = false;
      retryCountRef.current = 0;
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
        fallbackIntervalRef.current = null;
      }
      setupConnection();
    }
  }, [isEnabled, cleanupConnection, setupConnection]);

  const retryConnection = useCallback(() => {
    if (!isEnabled) {
      return;
    }
    
    console.log('Manual retry of real-time connection...');
    retryCountRef.current = 0;
    cleanupConnection();
    isCleaningUpRef.current = false;
    setTimeout(setupConnection, 1000);
  }, [cleanupConnection, setupConnection, isEnabled]);

  useEffect(() => {
    if (isEnabled) {
      isCleaningUpRef.current = false;
      // Start with fallback immediately, then try real-time
      startFallbackPolling();
      setupConnection();
    }

    return () => {
      cleanupConnection();
    };
  }, [setupConnection, cleanupConnection, isEnabled, startFallbackPolling]);

  return { 
    connectionStatus, 
    isEnabled,
    toggleConnection,
    retryConnection
  };
};
