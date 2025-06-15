
import { useState } from 'react';

export const useAllAnalysisPageState = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const handleViewAnalysis = (analysis: any) => {
    setSelectedAnalysis(analysis);
  };

  const handleRowClick = (analysis: any) => {
    handleViewAnalysis(analysis);
  };

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  return {
    selectedAnalysis,
    viewMode,
    setViewMode,
    showDiagnostics,
    setShowDiagnostics,
    handleViewAnalysis,
    handleRowClick,
    handleBackToList
  };
};
