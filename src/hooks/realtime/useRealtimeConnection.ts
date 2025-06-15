
import { useEffect, useState, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseRealtimeConnectionProps {
  onError: (error: Error) => void;
  onToast?: (title: string, description: string) => void;
}

export const useRealtimeConnection = ({ onError, onToast }: UseRealtimeConnectionProps) => {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'fallback'>('connecting');
  
  const channelRef = useRef<any>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const isCleaningUpRef = useRef(false);
  
  const MAX_RETRIES = 3;
  const CONNECTION_TIMEOUT = 10000;
  const RETRY_DELAY = 2000;

  const cleanupConnection = useCallback(() => {
    console.log('Cleaning up real-time connection...');
    isCleaningUpRef.current = true;

    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
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

  const handleConnectionSuccess = useCallback(() => {
    console.log('Real-time connection established successfully');
    setConnectionStatus('connected');
    retryCountRef.current = 0;
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
  }, []);

  const handleConnectionError = useCallback((status: string, error?: any) => {
    console.warn('Real-time subscription failed with status:', status, 'Error:', error);
    
    if (isCleaningUpRef.current) {
      return;
    }
    
    setConnectionStatus('error');
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    
    if (retryCountRef.current < MAX_RETRIES) {
      const retryDelay = RETRY_DELAY * Math.pow(2, retryCountRef.current);
      console.log(`Retrying real-time connection... Attempt ${retryCountRef.current + 1}/${MAX_RETRIES} in ${retryDelay}ms`);
      retryCountRef.current += 1;
      
      retryTimeoutRef.current = setTimeout(() => {
        if (!isCleaningUpRef.current) {
          setupConnection();
        }
      }, retryDelay);
    } else {
      console.warn('Max retries reached, falling back to polling');
      setConnectionStatus('fallback');
      onError(new Error(`Real-time updates failed after ${MAX_RETRIES} attempts. Using fallback polling.`));
    }
  }, [onError]);

  const setupConnection = useCallback(() => {
    if (isCleaningUpRef.current) {
      return;
    }

    const channelName = `analysis-updates-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Setting up real-time subscription with channel:', channelName);
    setConnectionStatus('connecting');
    
    connectionTimeoutRef.current = setTimeout(() => {
      console.warn('Real-time connection timed out');
      handleConnectionError('TIMED_OUT');
    }, CONNECTION_TIMEOUT);

    try {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

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
              onToast?.("New Analysis Available", "A new analysis has been completed and is now visible.");
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
              onToast?.("New Batch Analysis Available", "A new batch analysis has been completed and is now visible.");
            }
          }
        )
        .subscribe((status, err) => {
          console.log('Real-time subscription status:', status, err);
          
          if (isCleaningUpRef.current) {
            return;
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
  }, [queryClient, onToast, handleConnectionSuccess, handleConnectionError]);

  return {
    connectionStatus,
    setupConnection,
    cleanupConnection,
    isCleaningUp: isCleaningUpRef.current
  };
};
