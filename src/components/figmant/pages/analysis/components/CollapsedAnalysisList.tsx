
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface CollapsedAnalysisListProps {
  analyses: any[];
  onItemClick: (analysis: any) => void;
  onExpandPanel?: () => void;
}

export const CollapsedAnalysisList: React.FC<CollapsedAnalysisListProps> = ({
  analyses,
  onItemClick,
  onExpandPanel
}) => {
  return (
    <div className="flex-1 flex flex-col items-center pt-4 space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-12 h-12 p-0 flex items-center justify-center"
        onClick={onExpandPanel}
        title="View Analysis History"
      >
        <FileText className="h-5 w-5" />
      </Button>
    </div>
  );
};
