
import React, { useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardQuickActions } from './dashboard/DashboardQuickActions';
import { DashboardAnalyticsTabsSection } from './dashboard/DashboardAnalyticsTabsSection';
import { EnhancedDashboardSkeleton } from './dashboard/components/EnhancedSkeletonLoading';
import { useDashboardOptimized } from '@/hooks/useDashboardOptimized';
import { useToast } from '@/hooks/use-toast';

export const DashboardPage: React.FC = () => {
  const {
    // Optimized data with real integration
    memoizedAnalysisData,
    memoizedInsightsData,
    memoizedDataStats,
    
    // Real data
    realData,
    
    // State management
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    // Enhanced actions
    refreshAllData,
    refreshInsights,
    // Loading states
    loadingStates,
    errorStates,
    // Performance
    performance,
    // Raw data access for widgets
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
        title: "Dashboard Error",
        description: "Failed to load dashboard data. Please try refreshing."
      });
    }
  }, [error, toast]);

  // Show enhanced loading state
  if (isLoading && memoizedAnalysisData.length === 0) {
    return <EnhancedDashboardSkeleton />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto space-y-8 2xl:max-w-none 2xl:px-8 px-0 py-0 pt-6">
        <DashboardHeader 
          dataStats={memoizedDataStats} 
          lastUpdated={lastUpdated ? new Date(lastUpdated) : null} 
          onRefresh={refreshAllData} 
          isRefreshing={isRefreshing} 
        />

        {/* PRIMARY FOCUS: Quick Actions - Most prominent position after header */}
        <DashboardQuickActions />

        {/* SECONDARY FOCUS: Business Intelligence Dashboard with Real Data */}
        <DashboardAnalyticsTabsSection 
          dataStats={memoizedDataStats} 
          analysisData={memoizedAnalysisData}
          realData={realData}
        />
      </div>
    </div>
  );
};
