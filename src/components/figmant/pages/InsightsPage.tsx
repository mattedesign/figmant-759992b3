
import React, { useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardAnalyticsTabsSection } from './dashboard/DashboardAnalyticsTabsSection';
import { EnhancedDashboardSkeleton } from './dashboard/components/EnhancedSkeletonLoading';
import { useDashboardOptimized } from '@/hooks/useDashboardOptimized';
import { useToast } from '@/hooks/use-toast';

export const InsightsPage: React.FC = () => {
  const {
    memoizedAnalysisData,
    memoizedInsightsData,
    memoizedDataStats,
    realData,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refreshAllData,
    refreshInsights,
    loadingStates,
    errorStates,
    performance,
    rawAnalysisData,
    userCredits
  } = useDashboardOptimized();
  const { toast } = useToast();

  // Performance measurement
  useEffect(() => {
    performance.startRenderMeasurement();
    return () => {
      performance.endRenderMeasurement();
    };
  }, [performance]);

  // Error handling
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Insights Error",
        description: "Failed to load insights data. Please try refreshing."
      });
    }
  }, [error, toast]);

  if (isLoading && memoizedAnalysisData.length === 0) {
    return <EnhancedDashboardSkeleton />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto space-y-8 2xl:max-w-none 2xl:px-8 px-0 py-0 pt-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Design Insights</h1>
            <p className="text-muted-foreground">
              Advanced analytics and AI-powered insights from your design analysis data
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={refreshAllData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Original Dashboard Header - Preserve exactly */}
        <DashboardHeader 
          dataStats={memoizedDataStats} 
          lastUpdated={lastUpdated ? new Date(lastUpdated) : null} 
          onRefresh={refreshAllData} 
          isRefreshing={isRefreshing} 
        />

        {/* Original Business Intelligence Dashboard - Preserve exactly */}
        <DashboardAnalyticsTabsSection 
          dataStats={memoizedDataStats} 
          analysisData={memoizedAnalysisData}
          realData={realData}
        />
      </div>
    </div>
  );
};
