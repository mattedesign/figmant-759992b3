
import React, { useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { RecentAnalysisSection } from './dashboard/RecentAnalysisSection';
import { InsightsSection } from './dashboard/InsightsSection';
import { PatternAnalysisSection } from './dashboard/PatternAnalysisSection';
import { DashboardMetricsSection } from './dashboard/DashboardMetricsSection';
import { DashboardAnalyticsTabsSection } from './dashboard/DashboardAnalyticsTabsSection';
import { EnhancedDashboardSkeleton } from './dashboard/components/EnhancedSkeletonLoading';
import { useDashboardOptimized } from '@/hooks/useDashboardOptimized';
import { useToast } from '@/hooks/use-toast';

export const DashboardPage: React.FC = () => {
  const {
    // Optimized data
    memoizedAnalysisData,
    memoizedInsightsData,
    memoizedDataStats,
    
    // State management
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    
    // Enhanced actions
    refreshAllData,
    refreshAnalyses,
    refreshInsights,
    
    // Loading states
    loadingStates,
    errorStates,
    
    // Performance
    performance,
    
    // Computed properties
    isDataEmpty,
    hasRecentActivity
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
        title: "Dashboard Error",
        description: "Failed to load dashboard data. Please try refreshing.",
      });
    }
  }, [error, toast]);

  // Show enhanced loading state
  if (isLoading && memoizedAnalysisData.length === 0) {
    return <EnhancedDashboardSkeleton />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-6 py-6 space-y-8 2xl:max-w-none 2xl:px-8">
        <DashboardHeader 
          dataStats={memoizedDataStats}
          lastUpdated={lastUpdated}
          onRefresh={refreshAllData}
          isRefreshing={isRefreshing}
        />

        {/* Key Metrics Section */}
        <DashboardMetricsSection
          dataStats={memoizedDataStats}
        />

        {/* Analytics Dashboard Section */}
        <DashboardAnalyticsTabsSection
          dataStats={memoizedDataStats}
          analysisData={memoizedAnalysisData}
        />
        
        {/* Main Content - Single Column Layout */}
        <div className="space-y-8">
          <RecentAnalysisSection 
            analysisData={memoizedAnalysisData}
            isLoading={loadingStates.analyses}
            error={errorStates.analyses}
            onRetry={refreshAnalyses}
          />
          
          {/* Pattern Analysis (1/3) and Insights (2/3) Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <PatternAnalysisSection />
            </div>
            
            <div className="lg:col-span-2">
              <InsightsSection 
                insightsData={memoizedInsightsData}
                isLoading={loadingStates.insights}
                error={errorStates.insights}
                onRetry={refreshInsights}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
