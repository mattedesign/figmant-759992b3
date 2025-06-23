import React, { useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardQuickActions } from './dashboard/DashboardQuickActions';
import { DashboardUXLaws } from './dashboard/DashboardUXLaws';
import { DashboardDownloads } from './dashboard/DashboardDownloads';
import { DashboardAnalyticsTabsSection } from './dashboard/DashboardAnalyticsTabsSection';
import { EnhancedDashboardSkeleton } from './dashboard/components/EnhancedSkeletonLoading';
import { useDashboardOptimized } from '@/hooks/useDashboardOptimized';
import { useToast } from '@/hooks/use-toast';

interface DashboardPageProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  user?: any;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  activeSection,
  onSectionChange,
  user
}) => {
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
        
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Ready to analyze your designs? Choose a quick action below or explore UX principles.
            </p>
          </div>
          <button 
            onClick={() => {
              // This will be connected to insights navigation
              console.log('Navigate to insights page');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Full Analytics →
          </button>
        </div>

        {/* Quick Actions Section */}
        <DashboardQuickActions />

        {/* UX Laws Section */}
        <DashboardUXLaws />

        {/* Free Downloads Section */}
        <DashboardDownloads />

      </div>
    </div>
  );
};
