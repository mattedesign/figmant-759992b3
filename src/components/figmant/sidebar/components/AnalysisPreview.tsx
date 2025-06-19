
import React from 'react';

interface AnalysisPreviewProps {
  analysis: any;
}

export const AnalysisPreview: React.FC<AnalysisPreviewProps> = ({ analysis }) => {
  const getAnalysisPreview = (analysis: any) => {
    if (analysis.type === 'chat') {
      return truncateText(analysis.prompt_used || 'Chat analysis');
    }
    return truncateText(analysis.analysis_results?.analysis || 'Design analysis');
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="mt-2 text-xs text-gray-600">
      <p className="font-medium mb-1">Preview:</p>
      <p className="text-gray-500">
        {getAnalysisPreview(analysis)}
      </p>
    </div>
  );
};
