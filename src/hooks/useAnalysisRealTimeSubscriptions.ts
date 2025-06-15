
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseAnalysisRealTimeSubscriptionsProps {
  onError: (error: Error) => void;
}

export const useAnalysisRealTimeSubscriptions = ({ onError }: UseAnalysisRealTimeSubscriptionsProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'fallback'>('connecting');
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  useEffect(() => {
    console.log('Setting up enhanced real-time subscriptions...');
    
    let analysisChannel: any = null;
    let retryTimeout: NodeJS.Timeout | null = null;
    let fallbackInterval: NodeJS.Timeout | null = null;
    
    const setupRealtimeConnection = async () => {
      try {
        setConnectionStatus('connecting');
        
        // Create a more focused channel with better error handling
        analysisChannel = supabase
          .channel('analysis-updates', {
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
              console.log('Real-time: New analysis inserted:', payload);
              queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
              
              toast({
                title: "New Analysis Available",
                description: "A new analysis has been completed and is now visible.",
              });
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
              console.log('Real-time: Upload status updated:', payload);
              queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
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
              console.log('Real-time: New batch analysis inserted:', payload);
              queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
              
              toast({
                title: "New Batch Analysis Available",
                description: "A new batch analysis has been completed and is now visible.",
              });
            }
          )
          .subscribe((status, err) => {
            console.log('Real-time subscription status:', status, err);
            
            if (status === 'SUBSCRIBED') {
              console.log('Real-time connection established successfully');
              setConnectionStatus('connected');
              setRetryCount(0); // Reset retry count on successful connection
              
              // Clear any existing fallback polling
              if (fallbackInterval) {
                clearInterval(fallbackInterval);
                fallbackInterval = null;
              }
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
              console.warn('Real-time subscription failed with status:', status, 'Error:', err);
              setConnectionStatus('error');
              
              // Implement retry logic
              if (retryCount < MAX_RETRIES) {
                console.log(`Retrying real-time connection... Attempt ${retryCount + 1}/${MAX_RETRIES}`);
                setRetryCount(prev => prev + 1);
                
                retryTimeout = setTimeout(() => {
                  setupRealtimeConnection();
                }, RETRY_DELAY * (retryCount + 1)); // Exponential backoff
              } else {
                console.warn('Max retries reached, falling back to polling');
                setConnectionStatus('fallback');
                setupFallbackPolling();
                
                // Only call onError after all retries are exhausted
                onError(new Error(`Real-time updates failed after ${MAX_RETRIES} attempts. Using fallback polling.`));
              }
            }
          });
          
      } catch (err) {
        console.error('Failed to set up real-time subscriptions:', err);
        setConnectionStatus('error');
        
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          retryTimeout = setTimeout(() => {
            setupRealtimeConnection();
          }, RETRY_DELAY * (retryCount + 1));
        } else {
          setConnectionStatus('fallback');
          setupFallbackPolling();
          onError(err as Error);
        }
      }
    };

    const setupFallbackPolling = () => {
      console.log('Setting up fallback polling for real-time updates...');
      
      // Poll for updates every 30 seconds as fallback
      fallbackInterval = setInterval(() => {
        console.log('Fallback polling: Refreshing analysis data...');
        queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
        queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
        queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      }, 30000);
    };

    // Start the initial connection
    setupRealtimeConnection();

    return () => {
      console.log('Cleaning up enhanced real-time subscriptions...');
      
      // Clear timeouts
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      
      // Clear fallback polling
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
      
      // Clean up channel
      if (analysisChannel) {
        try {
          supabase.removeChannel(analysisChannel);
        } catch (err) {
          console.error('Error cleaning up real-time channel:', err);
        }
      }
    };
  }, [queryClient, toast, onError, retryCount]);

  return { connectionStatus };
};
