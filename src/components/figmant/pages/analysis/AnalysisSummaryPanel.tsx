
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { AnalysisResults } from '@/components/design/chat/AnalysisResults';

interface AnalysisSummaryPanelProps {
  analysisResult: any;
  onBackToAttachments: () => void;
}

export const AnalysisSummaryPanel: React.FC<AnalysisSummaryPanelProps> = ({
  analysisResult,
  onBackToAttachments
}) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Analysis Summary</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBackToAttachments}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <Badge variant="secondary" className="text-xs">
            Analysis Complete
          </Badge>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <AnalysisResults 
          lastAnalysisResult={analysisResult}
          uploadIds={analysisResult?.uploadIds || []}
          showEnhancedSummary={true}
        />
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Save Analysis
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
