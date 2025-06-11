
import React from 'react';

interface AnalysisResultsSectionProps {
  lastAnalysisResult?: any;
}

export const AnalysisResultsSection: React.FC<AnalysisResultsSectionProps> = ({ 
  lastAnalysisResult 
}) => {
  if (!lastAnalysisResult) {
    return null;
  }

  return (
    <div>
      <h4 className="font-medium text-sm mb-2">Last Analysis Result</h4>
      <div className="p-3 bg-white rounded border">
        <pre className="text-xs overflow-auto max-h-40">
          {JSON.stringify(lastAnalysisResult, null, 2)}
        </pre>
      </div>
    </div>
  );
};
