
import React from 'react';
import { AllAnalysisFilters } from './AllAnalysisFilters';
import { AllAnalysisViewContent } from './AllAnalysisViewContent';
import { AllAnalysisLoadingState } from './AllAnalysisLoadingState';
import { AnalysisDetailView } from './AnalysisDetailView';
import { useSimplifiedAnalysisData } from '@/hooks/useSimplifiedAnalysisData';
import { useAllAnalysisFilters } from './useAllAnalysisFilters';
import { useAllAnalysisPageState } from './hooks/useAllAnalysisPageState';
import { ErrorDisplay } from './components/ErrorDisplay';
import { PageHeader } from './components/PageHeader';
import { DiagnosticsSection } from './components/DiagnosticsSection';
import { EnhancedErrorBoundary } from './components/EnhancedErrorBoundary';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useEnhancedAnalysisDataProcessor } from '@/hooks/useEnhancedAnalysisDataProcessor';
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

  // Use simplified hook for data management with performance monitoring
  const {
    groupedAnalyses,
    allAnalyses,
    isLoading,
    isRefreshing,
    error,
    connectionStatus,
    isRealTimeEnabled,
    handleManualRefresh,
    retryFailedQueries,
    clearError,
    toggleRealTime,
    retryConnection
  } = useSimplifiedAnalysisData();

  // Enhanced data processing with caching
  const processedData = useEnhancedAnalysisDataProcessor(groupedAnalyses, {
    enableGrouping: true,
    enableSorting: true,
    sortDirection: 'desc',
    sortField: 'created_at'
  });

  // Use processed data for filtering
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    filteredAnalyses,
    filteredGroupedAnalyses
  } = useAllAnalysisFilters(processedData.allAnalyses, groupedAnalyses);

  // Log performance metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const report = getReport();
      if (report.totalOperations > 0) {
        console.log('Analysis Page Performance:', {
          averageLoadTime: `${report.averageDuration.toFixed(2)}ms`,
          totalOperations: report.totalOperations,
          slowestOperation: report.slowestOperation?.name,
          slowestDuration: report.slowestOperation?.duration?.toFixed(2)
        });
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [getReport]);

  // Enhanced manual refresh with performance monitoring
  const handleEnhancedRefresh = async () => {
    await measureAsync('manual-refresh', handleManualRefresh);
  };

  // Show error state only for critical data fetching errors, not real-time connection issues
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

        <AllAnalysisFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
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
