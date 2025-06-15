
import React from 'react';
import { AllAnalysisPageHeader } from '../AllAnalysisPageHeader';

interface SimplifiedPageHeaderProps {
  viewMode: 'grouped' | 'table';
  onViewModeChange: (mode: 'grouped' | 'table') => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  filteredGroupedAnalysesCount: number;
  totalGroupedAnalysesCount: number;
  filteredAnalysesCount: number;
  totalAnalysesCount: number;
}

export const SimplifiedPageHeader: React.FC<SimplifiedPageHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onManualRefresh,
  isRefreshing,
  filteredGroupedAnalysesCount,
  totalGroupedAnalysesCount,
  filteredAnalysesCount,
  totalAnalysesCount
}) => {
  return (
    <AllAnalysisPageHeader
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      onManualRefresh={onManualRefresh}
      isRefreshing={isRefreshing}
      filteredGroupedAnalysesCount={filteredGroupedAnalysesCount}
      totalGroupedAnalysesCount={totalGroupedAnalysesCount}
      filteredAnalysesCount={filteredAnalysesCount}
      totalAnalysesCount={totalAnalysesCount}
    />
  );
};
