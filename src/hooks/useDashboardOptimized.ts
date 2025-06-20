
import { useMemo } from 'react';
import { useDashboardDataManager } from './useDashboardDataManager';
import { useRealDashboardData } from './useRealDataIntegration';
import { useDashboardPerformance } from './useDashboardPerformance';

export const useDashboardOptimized = () => {
  const performance = useDashboardPerformance();
  
  // Get real data integration
  const {
    analysisMetrics,
    chatAnalysis,
    designAnalysis,
    isLoading: realDataLoading,
    error: realDataError
  } = useRealDashboardData();

  // Get existing dashboard data
  const {
    analysisData,
    insightsData,
    promptsData,
    notesData,
    dataStats,
    hasAnyData,
    rawAnalysisData,
    userCredits,
    isLoading: dashboardLoading,
    isRefreshing,
    error: dashboardError,
    lastUpdated,
    refreshAllData,
    refreshAnalyses,
    refreshInsights,
    refreshPrompts,
    loadingStates,
    errorStates
  } = useDashboardDataManager();

  // Memoize processed data with real data integration
  const memoizedAnalysisData = useMemo(() => {
    // Combine existing analysis data with real metrics
    return analysisData.map(analysis => ({
      ...analysis,
      realMetrics: analysisMetrics.find(metric => 
        new Date(metric.created_at).toDateString() === new Date().toDateString()
      )
    }));
  }, [analysisData, analysisMetrics]);

  const memoizedInsightsData = useMemo(() => {
    // Enhance insights with real chat analysis data
    return insightsData.map(insight => ({
      ...insight,
      realChatData: chatAnalysis.slice(0, 5) // Latest 5 chat analyses
    }));
  }, [insightsData, chatAnalysis]);

  const memoizedDataStats = useMemo(() => {
    // Calculate enhanced stats with real data
    const realSuccessRate = analysisMetrics.length > 0 
      ? (analysisMetrics.filter(m => m.analysis_success).length / analysisMetrics.length) * 100
      : dataStats.activityScore;

    const avgProcessingTime = analysisMetrics.length > 0
      ? analysisMetrics.reduce((sum, m) => sum + (m.processing_time_ms || 0), 0) / analysisMetrics.length
      : 0;

    return {
      ...dataStats,
      realSuccessRate,
      avgProcessingTime,
      totalRealAnalyses: designAnalysis.length,
      avgConfidenceScore: designAnalysis.length > 0
        ? designAnalysis.reduce((sum, d) => sum + (d.confidence_score || 0), 0) / designAnalysis.length
        : 0
    };
  }, [dataStats, analysisMetrics, designAnalysis]);

  // Combine loading states
  const isLoading = dashboardLoading || realDataLoading;
  const error = dashboardError || realDataError;

  return {
    // Enhanced data with real integration
    memoizedAnalysisData,
    memoizedInsightsData,
    memoizedDataStats,
    
    // Real data
    realData: {
      analysisMetrics,
      chatAnalysis,
      designAnalysis
    },
    
    // State management
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    
    // Enhanced actions
    refreshAllData,
    refreshInsights,
    
    // Loading states
    loadingStates: {
      ...loadingStates,
      realData: realDataLoading
    },
    errorStates: {
      ...errorStates,
      realData: realDataError
    },
    
    // Performance
    performance,
    
    // Raw data access for widgets
    rawAnalysisData,
    userCredits,
    
    // Legacy compatibility
    hasAnyData
  };
};
