
import React from 'react';
import { Button } from '@/components/ui/button';
import { getTemplateIcon } from './TemplateIcon';

interface CollapsedAnalysisListProps {
  analyses: any[];
  onItemClick: (analysis: any) => void;
}

export const CollapsedAnalysisList: React.FC<CollapsedAnalysisListProps> = ({
  analyses,
  onItemClick
}) => {
  return (
    <div className="flex-1 flex flex-col items-center pt-4 space-y-4">
      {analyses.slice(0, 5).map((analysis) => {
        const TemplateIcon = getTemplateIcon(analysis.analysisType);
        return (
          <Button
            key={`${analysis.type}-${analysis.id}`}
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => onItemClick(analysis)}
            title={analysis.title}
          >
            <TemplateIcon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
};
