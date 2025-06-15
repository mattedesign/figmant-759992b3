
import { useMemo } from 'react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useGroupedAnalyses } from '@/hooks/useGroupedAnalyses';
import { useAnalysisErrorHandling } from '@/hooks/useAnalysisErrorHandling';
import { useAnalysisRefreshOperations } from '@/hooks/useAnalysisRefreshOperations';
import { useAnalysisDataProcessor } from '@/hooks/useAnalysisDataProcessor';

interface UseSimplifiedAnalysisDataReturn {
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

export const useSimplifiedAnalysisData = (): UseSimplifiedAnalysisDataReturn => {
  // Error handling - only for data fetching errors
  const { error: localError, clearError, handleError } = useAnalysisErrorHandling();

  // Fetch data - these are the critical queries that must succeed
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

  // Only combine actual data fetching errors
  const combinedError = useMemo(() => {
    const dataErrors = [uploadsError, batchError, individualError].filter(Boolean);
    if (dataErrors.length > 0) {
      return dataErrors[0]; // Return the first data error
    }
    return localError; // Only return local error if no data errors
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

  // Only consider data loading states
  const isLoading = uploadsLoading || batchLoading || individualLoading;

  return {
    uploads,
    batchAnalyses,
    individualAnalyses,
    groupedAnalyses,
    allAnalyses,
    isLoading,
    isRefreshing,
    error: combinedError, // Only data errors
    handleManualRefresh,
    retryFailedQueries,
    clearError
  };
};
