
import React, { useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardAnalyticsTabsSection } from './dashboard/DashboardAnalyticsTabsSection';
import { EnhancedDashboardSkeleton } from './dashboard/components/EnhancedSkeletonLoading';
import { useDashboardOptimized } from '@/hooks/useDashboardOptimized';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

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

  // Responsive container classes
  const getContainerClasses = () => {
    if (isMobile) {
      return "container mx-auto space-y-4 px-3 py-4 max-w-full";
    }
    if (isTablet) {
      return "container mx-auto space-y-6 px-4 py-5 max-w-full";
    }
    return "container mx-auto space-y-8 2xl:max-w-none 2xl:px-8 px-0 py-0 pt-6";
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className={getContainerClasses()}>
        <DashboardHeader 
          dataStats={memoizedDataStats} 
          lastUpdated={lastUpdated ? new Date(lastUpdated) : null} 
          onRefresh={refreshAllData} 
          isRefreshing={isRefreshing} 
        />

        {/* PRIMARY FOCUS: Business Intelligence Dashboard with Real Data - Most prominent position */}
        <DashboardAnalyticsTabsSection 
          dataStats={memoizedDataStats} 
          analysisData={memoizedAnalysisData}
          realData={realData}
        />
      </div>
    </div>
  );
};
