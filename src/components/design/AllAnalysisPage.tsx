
import React, { useState } from 'react';
import { AllAnalysisFilters } from './analysis/AllAnalysisFilters';
import { AllAnalysisPageHeader } from './analysis/AllAnalysisPageHeader';
import { AllAnalysisViewContent } from './analysis/AllAnalysisViewContent';
import { AllAnalysisLoadingState } from './analysis/AllAnalysisLoadingState';
import { AnalysisDetailView } from './analysis/AnalysisDetailView';
import { useAllAnalysisData } from './analysis/useAllAnalysisData';
import { useAllAnalysisFilters } from './analysis/useAllAnalysisFilters';

export const AllAnalysisPage = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');

  // Use custom hooks for data management
  const {
    groupedAnalyses,
    allAnalyses,
    isLoading,
    isRefreshing,
    handleManualRefresh
  } = useAllAnalysisData();

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

  const handleViewAnalysis = (analysis: any) => {
    setSelectedAnalysis(analysis);
  };

  const handleRowClick = (analysis: any) => {
    handleViewAnalysis(analysis);
  };

  if (isLoading) {
    return <AllAnalysisLoadingState />;
  }

  if (selectedAnalysis) {
    return (
      <AnalysisDetailView 
        analysis={selectedAnalysis} 
        onBack={() => setSelectedAnalysis(null)} 
      />
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <AllAnalysisPageHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onManualRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        filteredGroupedAnalysesCount={filteredGroupedAnalyses.length}
        totalGroupedAnalysesCount={groupedAnalyses.length}
        filteredAnalysesCount={filteredAnalyses.length}
        totalAnalysesCount={allAnalyses.length}
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
