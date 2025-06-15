
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AnalysisDetailViewProps {
  analysis: any;
  onBack: () => void;
}

export const AnalysisDetailView: React.FC<AnalysisDetailViewProps> = ({
  analysis,
  onBack
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 p-4">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analysis List
        </Button>
        <h1 className="text-2xl font-bold">Analysis Details</h1>
      </div>
      
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">
            {analysis?.title || 'Analysis Title'}
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">
              Detailed analysis view for: {analysis?.id || 'N/A'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This component will show the full analysis results and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
