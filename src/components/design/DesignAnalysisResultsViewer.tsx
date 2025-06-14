
import React from 'react';
import { UnifiedAnalysisResultsViewer } from './UnifiedAnalysisResultsViewer';

interface AnalysisResultsViewerProps {
  analysisData: any;
  upload?: any;
  uploads?: any[];
  title?: string;
  type?: 'individual' | 'batch';
}

export const DesignAnalysisResultsViewer: React.FC<AnalysisResultsViewerProps> = ({
  analysisData,
  upload,
  uploads,
  title,
  type = 'individual'
}) => {
  return (
    <UnifiedAnalysisResultsViewer
      analysisData={analysisData}
      analysisType={type}
      upload={upload}
      uploads={uploads}
      title={title}
    />
  );
};
