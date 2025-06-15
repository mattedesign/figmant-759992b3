
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

  // Use simplified hook for data management
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

  // Use custom hook for filtering
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    filteredAnalyses,
    filteredGroupedAnalyses
  } = useAllAnalysisFilters(allAnalyses, groupedAnalyses);

  // Show error state only for critical data fetching errors, not real-time connection issues
  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        onRetry={retryFailedQueries} 
        onClear={clearError} 
      />
    );
  }

  // Show loading state only for initial data loading
  if (isLoading) {
    return <AllAnalysisLoadingState />;
  }

  // Show detail view if analysis is selected
  if (selectedAnalysis) {
    return (
      <AnalysisDetailView 
        analysis={selectedAnalysis} 
        onBack={handleBackToList} 
      />
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <PageHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onManualRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        filteredGroupedAnalysesCount={filteredGroupedAnalyses.length}
        totalGroupedAnalysesCount={groupedAnalyses.length}
        filteredAnalysesCount={filteredAnalyses.length}
        totalAnalysesCount={allAnalyses.length}
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
  );
};

export default AllAnalysisPageEnhanced;
