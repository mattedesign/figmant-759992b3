
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface UseAnalysisRefreshOperationsProps {
  refetchUploads: () => Promise<any>;
  refetchBatch: () => Promise<any>;
  refetchIndividual: () => Promise<any>;
  onError: (error: Error) => void;
}

export const useAnalysisRefreshOperations = ({
  refetchUploads,
  refetchBatch,
  refetchIndividual,
  onError
}: UseAnalysisRefreshOperationsProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleManualRefresh = useCallback(async () => {
    console.log('Enhanced manual refresh triggered...');
    setIsRefreshing(true);
    
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
      onError(error as Error);
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchUploads, refetchBatch, refetchIndividual, toast, onError]);

  const retryFailedQueries = useCallback(async () => {
    console.log('Retrying failed queries...');
    
    try {
      // Clear any failed queries from cache
      queryClient.removeQueries({ 
        predicate: (query) => query.state.status === 'error' 
      });
      
      // Retry all queries
      await handleManualRefresh();
    } catch (err) {
      console.error('Failed to retry queries:', err);
      onError(err as Error);
    }
  }, [queryClient, handleManualRefresh, onError]);

  return {
    isRefreshing,
    handleManualRefresh,
    retryFailedQueries
  };
};
