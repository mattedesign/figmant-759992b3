
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseAnalysisRealTimeSubscriptionsProps {
  onError: (error: Error) => void;
}

export const useAnalysisRealTimeSubscriptions = ({ onError }: UseAnalysisRealTimeSubscriptionsProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up enhanced real-time subscriptions...');
    
    let analysisChannel: any = null;
    
    try {
      analysisChannel = supabase
        .channel('analysis-updates-enhanced')
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
        .subscribe((status) => {
          console.log('Real-time subscription status:', status);
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error('Real-time subscription failed with status:', status);
            onError(new Error(`Real-time updates failed to connect: ${status}`));
          }
        });
    } catch (err) {
      console.error('Failed to set up real-time subscriptions:', err);
      onError(err as Error);
    }

    return () => {
      console.log('Cleaning up enhanced real-time subscriptions...');
      if (analysisChannel) {
        try {
          supabase.removeChannel(analysisChannel);
        } catch (err) {
          console.error('Error cleaning up real-time channel:', err);
        }
      }
    };
  }, [queryClient, toast, onError]);
};
