
import React from 'react';
import { AllAnalysisTable } from './AllAnalysisTable';
import { GroupedAnalysisTable } from './GroupedAnalysisTable';

interface AllAnalysisViewContentProps {
  viewMode: 'grouped' | 'table';
  filteredGroupedAnalyses: any[];
  filteredAnalyses: any[];
  onViewAnalysis: (analysis: any) => void;
  onRowClick: (analysis: any) => void;
}

export const AllAnalysisViewContent: React.FC<AllAnalysisViewContentProps> = ({
  viewMode,
  filteredGroupedAnalyses,
  filteredAnalyses,
  onViewAnalysis,
  onRowClick
}) => {
  if (viewMode === 'grouped') {
    return (
      <GroupedAnalysisTable
        groupedAnalyses={filteredGroupedAnalyses}
        onViewAnalysis={onViewAnalysis}
      />
    );
  }

  return (
    <AllAnalysisTable
      analyses={filteredAnalyses}
      onRowClick={onRowClick}
      onViewAnalysis={onViewAnalysis}
    />
  );
};
