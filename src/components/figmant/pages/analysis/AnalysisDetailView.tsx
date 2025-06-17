
import React from 'react';
import { AnalysisListSidebar } from './AnalysisListSidebar';

interface AnalysisDetailViewProps {
  selectedAnalysis: any;
  onAnalysisSelect: (analysis: any) => void;
  onBackFromDetail: () => void;
}

export const AnalysisDetailView: React.FC<AnalysisDetailViewProps> = ({
  selectedAnalysis,
  onAnalysisSelect,
  onBackFromDetail
}) => {
  return (
    <div className="h-full flex">
      <AnalysisListSidebar 
        selectedAnalysis={selectedAnalysis}
        onAnalysisSelect={onAnalysisSelect}
      />
      <div className="flex-1 p-6">
        <div className="mb-4">
          <button 
            onClick={onBackFromDetail}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Back to Analysis
          </button>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Analysis Results</h3>
              <p className="text-gray-600 mt-2">
                Detailed analysis results would be displayed here...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
