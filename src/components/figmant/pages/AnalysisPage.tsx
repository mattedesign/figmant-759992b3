
import React from 'react';
import { AnalysisPageContainer } from './analysis/AnalysisPageContainer';

interface AnalysisPageProps {
  selectedTemplate?: any;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ selectedTemplate }) => {
  return (
    <div className="h-full flex flex-col bg-[#F9FAFB] min-h-0">
      <div className="px-6 pt-6 pb-3 bg-transparent flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analysis Management</h1>
            <p className="text-gray-600 mt-1">View and manage your design analysis history</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <AnalysisPageContainer selectedTemplate={selectedTemplate} />
      </div>
    </div>
  );
};
