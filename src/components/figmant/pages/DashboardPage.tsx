
import React, { useEffect } from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { RecentAnalysisSection } from './dashboard/RecentAnalysisSection';
import { InsightsSection } from './dashboard/InsightsSection';
import { PatternAnalysisSection } from './dashboard/PatternAnalysisSection';
import { MyPromptsSection } from './dashboard/MyPromptsSection';
import { NotesSection } from './dashboard/NotesSection';
import { DashboardAnalyticsSection } from './dashboard/DashboardAnalyticsSection';
import { InteractiveDashboardActions } from './dashboard/components/InteractiveDashboardActions';
import { EnhancedDashboardSkeleton } from './dashboard/components/EnhancedSkeletonLoading';
import { useDashboardOptimized } from '@/hooks/useDashboardOptimized';
import { useToast } from '@/hooks/use-toast';

export const DashboardPage: React.FC = () => {
  const {
    // Optimized data
    memoizedAnalysisData,
    memoizedInsightsData,
    memoizedPromptsData,
    memoizedNotesData,
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
    refreshPrompts,
    refreshNotes,
    handleExport,
    handleSearch,
    handleFilter,
    
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
      <div className="container mx-auto px-6 py-6 space-y-8">
        <DashboardHeader 
          dataStats={memoizedDataStats}
          lastUpdated={lastUpdated}
          onRefresh={refreshAllData}
          isRefreshing={isRefreshing}
        />
        
        {/* Interactive Actions Bar */}
        <InteractiveDashboardActions
          onRefresh={refreshAllData}
          onExport={handleExport}
          onFilter={handleFilter}
          onSearch={handleSearch}
          isLoading={isRefreshing}
          dataCount={memoizedAnalysisData.length}
        />

        {/* Advanced Analytics Section */}
        <DashboardAnalyticsSection
          dataStats={memoizedDataStats}
          analysisData={memoizedAnalysisData}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <RecentAnalysisSection 
              analysisData={memoizedAnalysisData}
              isLoading={loadingStates.analyses}
              error={errorStates.analyses}
              onRetry={refreshAnalyses}
            />
            <InsightsSection 
              insightsData={memoizedInsightsData}
              isLoading={loadingStates.insights}
              error={errorStates.insights}
              onRetry={refreshInsights}
            />
            <PatternAnalysisSection />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <MyPromptsSection 
              promptsData={memoizedPromptsData}
              isLoading={loadingStates.prompts}
              error={errorStates.prompts}
              onRetry={refreshPrompts}
            />
            <NotesSection 
              notesData={memoizedNotesData}
              isLoading={loadingStates.notes}
              error={errorStates.notes}
              onRetry={refreshNotes}
            />
          </div>
        </div>
        
        {/* Performance Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
            <div>Render Time: {performance.metrics.renderTime.toFixed(2)}ms</div>
            <div>Processing Time: {performance.metrics.dataProcessingTime.toFixed(2)}ms</div>
            <div>Cache Hit Rate: {performance.metrics.cacheHitRate.toFixed(1)}%</div>
            <div>Activity Score: {memoizedDataStats.activityScore}</div>
          </div>
        )}
      </div>
    </div>
  );
};
