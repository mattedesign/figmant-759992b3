
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useGroupedAnalyses } from '@/hooks/useGroupedAnalyses';
import { useToast } from '@/hooks/use-toast';

interface UseAllAnalysisDataEnhancedReturn {
  uploads: any[];
  batchAnalyses: any[];
  individualAnalyses: any[];
  groupedAnalyses: any[];
  allAnalyses: any[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  handleManualRefresh: () => Promise<void>;
  retryFailedQueries: () => Promise<void>;
  clearError: () => void;
}

export const useAllAnalysisDataEnhanced = (): UseAllAnalysisDataEnhancedReturn => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch data with error handling
  const { 
    data: uploads = [], 
    isLoading: uploadsLoading, 
    error: uploadsError,
    refetch: refetchUploads 
  } = useDesignUploads();

  const { 
    data: batchAnalyses = [], 
    isLoading: batchLoading, 
    error: batchError,
    refetch: refetchBatch 
  } = useDesignBatchAnalyses();

  const { 
    data: individualAnalyses = [], 
    isLoading: individualLoading, 
    error: individualError,
    refetch: refetchIndividual 
  } = useDesignAnalyses();

  // Combine all errors
  const combinedError = useMemo(() => {
    return uploadsError || batchError || individualError || error;
  }, [uploadsError, batchError, individualError, error]);

  // Group analyses using the hook
  const groupedAnalyses = useGroupedAnalyses(uploads, individualAnalyses, batchAnalyses);

  // Enhanced real-time subscriptions with better error handling
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
          if (status === 'SUBSCRIPTION_ERROR') {
            console.error('Real-time subscription failed');
            setError(new Error('Real-time updates failed to connect'));
          }
        });
    } catch (err) {
      console.error('Failed to set up real-time subscriptions:', err);
      setError(err as Error);
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
  }, [queryClient, toast]);

  // Enhanced manual refresh function
  const handleManualRefresh = useCallback(async () => {
    console.log('Enhanced manual refresh triggered...');
    setIsRefreshing(true);
    setError(null);
    
    try {
      const refreshPromises = [
        refetchUploads(),
        refetchBatch(),
        refetchIndividual()
      ];

      const results = await Promise.allSettled(refreshPromises);
      
      // Check for any failed refreshes
      const failures = results.filter(result => result.status === 'rejected');
      
      if (failures.length > 0) {
        console.error('Some queries failed during refresh:', failures);
        throw new Error(`Failed to refresh ${failures.length} data source(s)`);
      }
      
      toast({
        title: "Data Refreshed",
        description: "All analysis data has been refreshed successfully.",
      });
    } catch (error) {
      console.error('Error during enhanced manual refresh:', error);
      setError(error as Error);
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchUploads, refetchBatch, refetchIndividual, toast]);

  // Retry failed queries
  const retryFailedQueries = useCallback(async () => {
    console.log('Retrying failed queries...');
    setError(null);
    
    try {
      // Clear any failed queries from cache
      queryClient.removeQueries({ 
        predicate: (query) => query.state.status === 'error' 
      });
      
      // Retry all queries
      await handleManualRefresh();
    } catch (err) {
      console.error('Failed to retry queries:', err);
      setError(err as Error);
    }
  }, [queryClient, handleManualRefresh]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Convert grouped analyses back to flat list for filtering in table view
  const allAnalyses = useMemo(() => {
    try {
      const flatAnalyses: any[] = [];
      
      groupedAnalyses.forEach(group => {
        // Add the primary analysis
        flatAnalyses.push(group.primaryAnalysis);
        // Add all related analyses
        flatAnalyses.push(...group.relatedAnalyses);
      });
      
      return flatAnalyses.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (err) {
      console.error('Error processing grouped analyses:', err);
      setError(err as Error);
      return [];
    }
  }, [groupedAnalyses]);

  const isLoading = uploadsLoading || batchLoading || individualLoading;

  return {
    uploads,
    batchAnalyses,
    individualAnalyses,
    groupedAnalyses,
    allAnalyses,
    isLoading,
    isRefreshing,
    error: combinedError,
    handleManualRefresh,
    retryFailedQueries,
    clearError
  };
};
