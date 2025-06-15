
import React from 'react';
import { AllAnalysisViewContent } from './AllAnalysisViewContent';
import { AllAnalysisLoadingState } from './AllAnalysisLoadingState';
import { AnalysisDetailView } from './AnalysisDetailView';
import { useSimplifiedAnalysisData } from '@/hooks/useSimplifiedAnalysisData';
import { useEnhancedAnalysisFilters } from '@/hooks/useEnhancedAnalysisFilters';
import { useAllAnalysisPageState } from './hooks/useAllAnalysisPageState';
import { ErrorDisplay } from './components/ErrorDisplay';
import { PageHeader } from './components/PageHeader';
import { DiagnosticsSection } from './components/DiagnosticsSection';
import { EnhancedErrorBoundary } from './components/EnhancedErrorBoundary';
import { EnhancedFiltersPanel } from './components/EnhancedFiltersPanel';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useEnhancedAnalysisDataProcessor } from '@/hooks/useEnhancedAnalysisDataProcessor';
import { useEnhancedRealTimeConnection } from '@/hooks/useEnhancedRealTimeConnection';
import { useEffect } from 'react';

const AllAnalysisPageEnhanced = () => {
  const {
    selectedAnalysis,
    viewMode,
    setViewMode,
    showDiagnostics,
    setShowDiagnostics,
    handleViewAnalysis,
    handleRowClick,
    handleBackToList
  } = useAllAnalysisPageState();

  const { measureAsync, getReport } = usePerformanceMonitor();

  // Enhanced real-time connection
  const {
    connectionStatus,
    isEnabled: isRealTimeEnabled,
    toggleConnection: toggleRealTime,
    retryConnection,
    metrics: connectionMetrics,
    recentEvents,
    connectionQuality
  } = useEnhancedRealTimeConnection();

  // Use simplified hook for data management with performance monitoring
  const {
    groupedAnalyses,
    allAnalyses,
    isLoading,
    isRefreshing,
    error,
    handleManualRefresh,
    retryFailedQueries,
    clearError
  } = useSimplifiedAnalysisData();

  // Enhanced data processing with caching
  const processedData = useEnhancedAnalysisDataProcessor(groupedAnalyses, {
    enableGrouping: true,
    enableSorting: true,
    sortDirection: 'desc',
    sortField: 'created_at'
  });

  // Enhanced filtering with advanced features
  const {
    filters,
    filteredAnalyses,
    filteredGroupedAnalyses,
    filterOptions,
    searchHistory,
    filterPresets,
    debouncedSearchTerm,
    updateFilter,
    updateMultipleFilters,
    resetFilters,
    saveFilterPreset,
    loadFilterPreset,
    deleteFilterPreset,
    quickFilters
  } = useEnhancedAnalysisFilters(processedData.allAnalyses, groupedAnalyses);

  // Log performance metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const report = getReport();
      if (report.totalOperations > 0) {
        console.log('Enhanced Analysis Page Performance:', {
          averageLoadTime: `${report.averageDuration.toFixed(2)}ms`,
          totalOperations: report.totalOperations,
          slowestOperation: report.slowestOperation?.name,
          slowestDuration: report.slowestOperation?.duration?.toFixed(2),
          connectionQuality,
          realtimeEvents: recentEvents.length
        });
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [getReport, connectionQuality, recentEvents.length]);

  // Enhanced manual refresh with performance monitoring
  const handleEnhancedRefresh = async () => {
    await measureAsync('enhanced-manual-refresh', handleManualRefresh);
  };

  // Show error state only for critical data fetching errors
  if (error) {
    return (
      <EnhancedErrorBoundary enableRecovery={true}>
        <ErrorDisplay 
          error={error} 
          onRetry={retryFailedQueries} 
          onClear={clearError} 
        />
      </EnhancedErrorBoundary>
    );
  }

  // Show loading state only for initial data loading
  if (isLoading) {
    return (
      <EnhancedErrorBoundary>
        <AllAnalysisLoadingState />
      </EnhancedErrorBoundary>
    );
  }

  // Show detail view if analysis is selected
  if (selectedAnalysis) {
    return (
      <EnhancedErrorBoundary enableRecovery={true}>
        <AnalysisDetailView 
          analysis={selectedAnalysis} 
          onBack={handleBackToList} 
        />
      </EnhancedErrorBoundary>
    );
  }

  return (
    <EnhancedErrorBoundary enableRecovery={true}>
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        <PageHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onManualRefresh={handleEnhancedRefresh}
          isRefreshing={isRefreshing}
          filteredGroupedAnalysesCount={filteredGroupedAnalyses.length}
          totalGroupedAnalysesCount={groupedAnalyses.length}
          filteredAnalysesCount={filteredAnalyses.length}
          totalAnalysesCount={processedData.allAnalyses.length}
          connectionStatus={connectionStatus}
          showDiagnostics={showDiagnostics}
          onShowDiagnosticsChange={setShowDiagnostics}
        />

        <DiagnosticsSection
          showDiagnostics={showDiagnostics}
          connectionStatus={connectionStatus}
          isRealTimeEnabled={isRealTimeEnabled}
          onToggleRealTime={toggleRealTime}
          onRetryConnection={retryConnection}
        />

        <EnhancedFiltersPanel
          filters={filters}
          filterOptions={filterOptions}
          searchHistory={searchHistory}
          filterPresets={filterPresets}
          debouncedSearchTerm={debouncedSearchTerm}
          updateFilter={updateFilter}
          updateMultipleFilters={updateMultipleFilters}
          resetFilters={resetFilters}
          saveFilterPreset={saveFilterPreset}
          loadFilterPreset={loadFilterPreset}
          deleteFilterPreset={deleteFilterPreset}
          quickFilters={quickFilters}
        />

        <AllAnalysisViewContent
          viewMode={viewMode}
          filteredGroupedAnalyses={filteredGroupedAnalyses}
          filteredAnalyses={filteredAnalyses}
          onViewAnalysis={handleViewAnalysis}
          onRowClick={handleRowClick}
        />
      </div>
    </EnhancedErrorBoundary>
  );
};

export default AllAnalysisPageEnhanced;
