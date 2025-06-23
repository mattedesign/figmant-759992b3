
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
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

  // Show loading state for new page
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
            <Button 
              variant="outline" 
              onClick={refreshAllData}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Move existing dashboard analytics content here */}
        <DashboardAnalyticsTabsSection 
          dataStats={memoizedDataStats} 
          analysisData={memoizedAnalysisData}
          realData={realData}
        />
      </div>
    </div>
  );
};
