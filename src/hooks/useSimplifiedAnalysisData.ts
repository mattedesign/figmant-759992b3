
import { useMemo } from 'react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useGroupedAnalyses } from '@/hooks/useGroupedAnalyses';
import { useSimplifiedRealTimeConnection } from './useSimplifiedRealTimeConnection';
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
  connectionStatus: 'connecting' | 'connected' | 'error' | 'fallback' | 'disabled';
  isRealTimeEnabled: boolean;
  handleManualRefresh: () => Promise<void>;
  retryFailedQueries: () => Promise<void>;
  clearError: () => void;
  toggleRealTime: () => void;
  retryConnection: () => void;
}

export const useSimplifiedAnalysisData = (): UseSimplifiedAnalysisDataReturn => {
  // Error handling - only for data fetching errors, not real-time connection issues
  const { error: localError, clearError, handleError } = useAnalysisErrorHandling();

  // Real-time connection - failures are handled gracefully and don't block data loading
  const { 
    connectionStatus, 
    isEnabled: isRealTimeEnabled,
    toggleConnection: toggleRealTime,
    retryConnection
  } = useSimplifiedRealTimeConnection({ 
    onError: (error) => {
      // Log real-time connection issues but don't treat them as blocking errors
      console.warn('Real-time connection issue (non-blocking):', error.message);
      // Explicitly don't call handleError here to avoid showing error state to user
    }
  });

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

  // Only combine actual data fetching errors - not real-time connection issues
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

  // Only consider data loading states - not real-time connection status
  const isLoading = uploadsLoading || batchLoading || individualLoading;

  return {
    uploads,
    batchAnalyses,
    individualAnalyses,
    groupedAnalyses,
    allAnalyses,
    isLoading,
    isRefreshing,
    error: combinedError, // Only data errors, not real-time connection errors
    connectionStatus,
    isRealTimeEnabled,
    handleManualRefresh,
    retryFailedQueries,
    clearError,
    toggleRealTime,
    retryConnection
  };
};
