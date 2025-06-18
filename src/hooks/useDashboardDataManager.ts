
import { useDashboardDataProcessor } from './useDashboardDataProcessor';
import { useAnalysisDataProcessor } from './useAnalysisDataProcessor';
import { useDashboardQueries } from './useDashboardQueries';
import { useDashboardActions } from './useDashboardActions';
import { useDashboardState } from './useDashboardState';

export const useDashboardDataManager = () => {
  // Get all dashboard queries
  const {
    designUploads,
    activityLogs,
    chatHistory,
    userCredits,
    user,
    isAnalysesLoading,
    isInsightsLoading,
    isPromptsLoading,
    isCreditsLoading,
    analysesError,
    insightsError,
    promptsError,
    refetchAnalyses,
    refetchInsights,
    refetchPrompts
  } = useDashboardQueries();

  // Get dashboard actions
  const {
    refreshAllData,
    refreshAnalyses,
    refreshInsights,
    refreshPrompts
  } = useDashboardActions({
    refetchAnalyses,
    refetchInsights,
    refetchPrompts
  });

  // Get dashboard state
  const {
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    loadingStates,
    errorStates
  } = useDashboardState({
    isAnalysesLoading,
    isInsightsLoading,
    isPromptsLoading,
    isCreditsLoading,
    analysesError,
    insightsError,
    promptsError
  });

  // Process grouped analyses for better organization
  const { allAnalyses } = useAnalysisDataProcessor([]);

  // Process dashboard data using the processor
  const {
    analysisData,
    insightsData,
    promptsData,
    notesData,
    hasAnyData,
    dataStats
  } = useDashboardDataProcessor(
    designUploads,
    activityLogs,
    chatHistory,
    [], // notes placeholder
    user
  );

  return {
    // Processed data
    analysisData,
    insightsData,
    promptsData,
    notesData,
    dataStats,
    hasAnyData,
    
    // Raw data for widgets
    rawAnalysisData: designUploads,
    userCredits,
    
    // State management
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    
    // Enhanced actions
    refreshAllData,
    refreshAnalyses,
    refreshInsights,
    refreshPrompts,
    
    // Loading and error states
    loadingStates,
    errorStates
  };
};
