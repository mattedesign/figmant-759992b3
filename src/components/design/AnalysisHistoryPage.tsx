
import React from 'react';
import { UnifiedAnalysisHistory } from './UnifiedAnalysisHistory';

export const AnalysisHistoryPage = () => {
  const handleViewAnalysis = (upload: any) => {
    console.log('Viewing analysis:', upload.id, upload.file_name);
  };

  return <UnifiedAnalysisHistory onViewAnalysis={handleViewAnalysis} />;
};
