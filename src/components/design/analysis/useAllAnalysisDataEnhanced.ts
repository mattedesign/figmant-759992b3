
import { useMemo } from 'react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useGroupedAnalyses } from '@/hooks/useGroupedAnalyses';
import { useAnalysisRealTimeSubscriptions } from '@/hooks/useAnalysisRealTimeSubscriptions';
import { useAnalysisErrorHandling } from '@/hooks/useAnalysisErrorHandling';
import { useAnalysisRefreshOperations } from '@/hooks/useAnalysisRefreshOperations';
import { useAnalysisDataProcessor } from '@/hooks/useAnalysisDataProcessor';

interface UseAllAnalysisDataEnhancedReturn {
  uploads: any[];
  batchAnalyses: any[];
  individualAnalyses: any[];
  groupedAnalyses: any[];
  allAnalyses: any[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  connectionStatus: 'connecting' | 'connected' | 'error' | 'fallback';
  handleManualRefresh: () => Promise<void>;
  retryFailedQueries: () => Promise<void>;
  clearError: () => void;
}

export const useAllAnalysisDataEnhanced = (): UseAllAnalysisDataEnhancedReturn => {
  // Error handling
  const { error: localError, clearError, handleError } = useAnalysisErrorHandling();

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
    return uploadsError || batchError || individualError || localError;
  }, [uploadsError, batchError, individualError, localError]);

  // Group analyses using the hook
  const groupedAnalyses = useGroupedAnalyses(uploads, individualAnalyses, batchAnalyses);

  // Process grouped analyses into flat list
  const { allAnalyses } = useAnalysisDataProcessor(groupedAnalyses);

  // Refresh operations
  const { isRefreshing, handleManualRefresh, retryFailedQueries } = useAnalysisRefreshOperations({
    refetchUploads,
    refetchBatch,
    refetchIndividual,
    onError: handleError
  });

  // Real-time subscriptions with enhanced error handling
  const { connectionStatus } = useAnalysisRealTimeSubscriptions({ 
    onError: (error) => {
      // Only treat connection errors as warnings, not blocking errors
      console.warn('Real-time connection issue:', error.message);
      // Don't call handleError here as it would show error state to user
      // Instead, the fallback polling will handle data updates
    }
  });

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
    connectionStatus,
    handleManualRefresh,
    retryFailedQueries,
    clearError
  };
};
