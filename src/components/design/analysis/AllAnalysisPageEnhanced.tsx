
import React from 'react';
import { AllAnalysisViewContent } from './AllAnalysisViewContent';
import { AllAnalysisLoadingState } from './AllAnalysisLoadingState';
import { AnalysisDetailView } from './AnalysisDetailView';
import { useSimplifiedAnalysisData } from '@/hooks/useSimplifiedAnalysisData';
import { useEnhancedAnalysisFiltersRefactored } from '@/hooks/useEnhancedAnalysisFiltersRefactored';
import { useAllAnalysisPageState } from './hooks/useAllAnalysisPageState';
import { ErrorDisplay } from './components/ErrorDisplay';
import { EnhancedErrorBoundary } from './components/EnhancedErrorBoundary';
import { EnhancedFiltersPanel } from './components/filters/EnhancedFiltersPanel';
import { useEnhancedAnalysisDataProcessor } from '@/hooks/useEnhancedAnalysisDataProcessor';
import { SimplifiedPageHeader } from './components/SimplifiedPageHeader';

const AllAnalysisPageEnhanced = () => {
  const {
    selectedAnalysis,
    viewMode,
    setViewMode,
    handleViewAnalysis,
    handleRowClick,
    handleBackToList
  } = useAllAnalysisPageState();

  // Use simplified hook for data management
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

  // Enhanced filtering with refactored hook
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
  } = useEnhancedAnalysisFiltersRefactored(processedData.allAnalyses, groupedAnalyses);

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
        <SimplifiedPageHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onManualRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          filteredGroupedAnalysesCount={filteredGroupedAnalyses.length}
          totalGroupedAnalysesCount={groupedAnalyses.length}
          filteredAnalysesCount={filteredAnalyses.length}
          totalAnalysesCount={processedData.allAnalyses.length}
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
