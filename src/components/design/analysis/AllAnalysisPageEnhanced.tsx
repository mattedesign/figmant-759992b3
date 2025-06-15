
import React, { useState } from 'react';
import { AllAnalysisFilters } from './AllAnalysisFilters';
import { AllAnalysisPageHeader } from './AllAnalysisPageHeader';
import { AllAnalysisViewContent } from './AllAnalysisViewContent';
import { AllAnalysisLoadingState } from './AllAnalysisLoadingState';
import { AnalysisDetailView } from './AnalysisDetailView';
import { useAllAnalysisDataEnhanced } from './useAllAnalysisDataEnhanced';
import { useAllAnalysisFilters } from './useAllAnalysisFilters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorDisplay: React.FC<{ 
  error: Error; 
  onRetry: () => void; 
  onClear: () => void; 
}> = ({ error, onRetry, onClear }) => {
  return (
    <div className="p-6">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Analysis Loading Error</span>
          </CardTitle>
          <CardDescription>
            There was an error loading the analysis data. Please try refreshing or contact support if the issue persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm text-red-800 font-medium">Error:</p>
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={onClear} variant="outline">
              Dismiss
            </Button>
            <Button onClick={onRetry} className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AllAnalysisPageEnhanced = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');

  // Use enhanced custom hook for data management
  const {
    groupedAnalyses,
    allAnalyses,
    isLoading,
    isRefreshing,
    error,
    handleManualRefresh,
    retryFailedQueries,
    clearError
  } = useAllAnalysisDataEnhanced();

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

  // Show error state if there's an error
  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        onRetry={retryFailedQueries} 
        onClear={clearError} 
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return <AllAnalysisLoadingState />;
  }

  // Show detail view if analysis is selected
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

export default AllAnalysisPageEnhanced;
