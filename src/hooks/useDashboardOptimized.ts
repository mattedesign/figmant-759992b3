
import { useCallback } from 'react';
import { useDashboardDataManager } from './useDashboardDataManager';
import { useDashboardMemoization } from './useDashboardMemoization';
import { useDashboardPerformance } from './useDashboardPerformance';

export const useDashboardOptimized = () => {
  // Get base dashboard data
  const dashboardData = useDashboardDataManager();
  
  // Apply memoization optimizations
  const memoizedData = useDashboardMemoization(
    dashboardData.analysisData,
    dashboardData.insightsData,
    dashboardData.promptsData,
    dashboardData.notesData,
    dashboardData.dataStats
  );
  
  // Apply performance optimizations
  const performance = useDashboardPerformance();
  
  // Enhanced export functionality
  const handleExport = useCallback(async () => {
    performance.startProcessingMeasurement();
    
    try {
      const exportData = {
        analyses: memoizedData.memoizedAnalysisData,
        insights: memoizedData.memoizedInsightsData,
        prompts: memoizedData.memoizedPromptsData,
        notes: memoizedData.memoizedNotesData,
        statistics: memoizedData.memoizedDataStats,
        exportDate: new Date().toISOString(),
        exportType: 'dashboard_summary'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } finally {
      performance.endProcessingMeasurement();
    }
  }, [memoizedData, performance]);

  // Enhanced search functionality
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return memoizedData.memoizedAnalysisData;
    
    const lowerQuery = query.toLowerCase();
    return memoizedData.memoizedAnalysisData.filter(analysis =>
      analysis.title.toLowerCase().includes(lowerQuery) ||
      analysis.type.toLowerCase().includes(lowerQuery) ||
      analysis.status.toLowerCase().includes(lowerQuery)
    );
  }, [memoizedData.memoizedAnalysisData]);

  // Enhanced filter functionality
  const handleFilter = useCallback((filters: any) => {
    let filtered = memoizedData.memoizedAnalysisData;
    
    if (filters.status) {
      filtered = filtered.filter(analysis => 
        analysis.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter(analysis => 
        analysis.type.toLowerCase().includes(filters.type.toLowerCase())
      );
    }
    
    if (filters.dateRange) {
      // Add date filtering logic here
    }
    
    return filtered;
  }, [memoizedData.memoizedAnalysisData]);

  return {
    // Original dashboard data
    ...dashboardData,
    
    // Memoized and optimized data
    ...memoizedData,
    
    // Performance metrics
    performance,
    
    // Enhanced actions
    handleExport,
    handleSearch,
    handleFilter,
    
    // Raw data for widgets (expose the raw analysis data from dashboardData)
    rawAnalysisData: dashboardData.rawAnalysisData,
    userCredits: dashboardData.userCredits,
    
    // Additional computed properties
    isDataEmpty: memoizedData.memoizedAnalysisData.length === 0 &&
                 memoizedData.memoizedInsightsData.length === 0 &&
                 memoizedData.memoizedPromptsData.length === 0,
    
    hasRecentActivity: memoizedData.memoizedDataStats.activityScore > 20
  };
};
